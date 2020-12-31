import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { DqGame } from '../../../../shared/models/dq-game';
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
      tap(() => {
        this.allGamesSearched = true;
      }),
      catchError((error: any) => {
        this.snackBarService.showError(error.message ? error.message : 'An error has ocurred');
        return throwError(error);
      }),
    );
  }

  getGame(id: string): Observable<DqGame> {
    if (this.store.value.games) {
      return this.store.select<DqGame[]>('games').pipe(
        switchMap((games) => {
          const game = games.filter((t) => t._id === id)[0];
          return game ? of(game) : this.searchGame(id);
        }),
      );
    }
    return this.searchGame(id);
  }

  createNewGame(game: Partial<DqGame>): Observable<DqGame> {
    const dataGame = {
      ...game,
      players: game.players.map((player) => player._id),
      themes: game.themes.map((theme) => theme._id),
    };
    return this.apiService.post<DqGame>('games', dataGame).pipe(
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

  editGame(id: string, game: Partial<DqGame>): Observable<DqGame> {
    return this.apiService.put<DqGame>(`games/${id}`, game).pipe(
      tap((game_) => {
        if (game_) {
          const { games } = this.store.value;
          games[games.findIndex((t) => t._id === id)] = game_;
          this.store.set(
            'games',
            games,
          );
        }
      }),
      catchError((error) => throwError(error)),
    );
  }

  deleteGame(id: string): Observable<any> {
    return this.apiService.delete<DqGame>(`games/${id}`).pipe(
      tap(() => {
        const { games } = this.store.value;
        this.store.set('games', games.filter((t) => t._id !== id));
      }),
    );
  }

  private searchGame(id: string): Observable<DqGame> {
    return this.apiService.get<DqGame>(`games/${id}`).pipe(
      tap((games) => this.store.set(
        'games', this.store.value.games ? [games].concat(this.store.value.games) : [games],
      )),
    );
  }
}
