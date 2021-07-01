import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { DqGame, DqGameLight } from '../../../../shared/models/dq-game';
import { ApiService } from '../../../../shared/services/api.service';
import { SnackBarService } from '../../../../shared/services/snack-bar.service';
import { Store } from '../../../../store';

@Injectable()
export class GamesService {
  allGamesSearched = false;

  constructor(
    private apiService: ApiService,
    private store: Store,
    private snackBarService: SnackBarService,
  ) { }

  getGames(): Observable<DqGame[]> {
    if (this.store.value.games && this.allGamesSearched) {
      return this.store.select<DqGame[]>('games');
    }
    return this.apiService.get<DqGame[]>('games').pipe(
      tap((games) => this.store.set('games', games)),
      switchMap(() => {
        this.allGamesSearched = true;
        return this.store.select<DqGame[]>('games');
      }),
      catchError((error: any) => {
        this.snackBarService.showError(error.message ? error.message : 'An error has ocurred');
        return throwError(error);
      }),
    );
  }

  getFullGame(id: string): Observable<DqGame> {
    if (this.store.value.fullGames) {
      return this.store.select<DqGame[]>('fullGames').pipe(
        switchMap((games) => {
          const game = games.filter((t) => t._id === id)[0];
          return game ? of(game) : this.searchGame(id);
        }),
      );
    }
    return this.searchGame(id);
  }

  createNewGame(game: Partial<DqGame>): Observable<DqGameLight> {
    const dataGame: Partial<DqGameLight> = {
      ...game,
      players: game.players.map((player) => player._id),
      themes: game.themes.map((theme) => theme._id),
    };
    return this.apiService.post<DqGameLight>('games', dataGame as DqGameLight).pipe(
      tap((game_) => {
        const { games } = this.store.value;
        if (games) {
          games.push(game_);
          this.store.set(
            'games', games,
          );
        } else {
          this.store.set(
            'games', [game_],
          );
        }
      }),
    );
  }

  editGame(id: string, game: Partial<DqGame>): Observable<DqGameLight> {
    const dataGame = {
      ...game,
      players: game.players.map((player) => player._id),
      themes: game.themes.map((theme) => theme._id),
    };
    return this.apiService.put<DqGameLight>(`games/${id}`, dataGame).pipe(
      tap((game_) => {
        if (game_) {
          const { games } = this.store.value;
          if (!games) {
            this.store.set(
              'games',
              [game_],
            );
          } else {
            const index = games.findIndex((t) => t._id === id);
            if (index) {
              games[index] = game_;
            } else {
              games.push(game_);
            }
            this.store.set(
              'games',
              games,
            );
          }
          this.store.resetGames();
        }
      }),
      catchError((error) => throwError(error)),
    );
  }

  deleteGame(id: string): Observable<any> {
    return this.apiService.delete<DqGame>(`games/${id}`).pipe(
      tap(() => {
        const { games } = this.store.value;
        this.store.set('games', [...games.filter((t) => t._id !== id)]);
      }),
    );
  }

  private searchGame(id: string): Observable<DqGame> {
    return this.apiService.get<DqGame>(`games/${id}`).pipe(
      tap((games) => this.store.set(
        'fullGames', this.store.value.fullGames ? [games].concat(this.store.value.fullGames) : [games],
      )),
    );
  }
}
