import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { DqPlayer } from '../../../../shared/models/dq-player';
import { ApiService } from '../../../../shared/services/api.service';
import { Store } from '../../../../store';

@Injectable()
export class PlayersService {
  allPlayersSearched = false;

  constructor(
    private apiService: ApiService,
    private store: Store,
  ) { }

  getPLayers(): Observable<DqPlayer[]> {
    if (this.store.value.players && this.allPlayersSearched) {
      return this.store.select<DqPlayer[]>('players');
    }
    return this.apiService.get<DqPlayer[]>('players').pipe(
      tap((players) => this.store.set('players', players)),
      tap(() => {
        this.allPlayersSearched = true;
      }),
    );
  }

  getPLayer(id: string): Observable<DqPlayer> {
    if (this.store.value.players) {
      return this.store.select<DqPlayer[]>('players').pipe(
        switchMap((players) => {
          const player = players.filter((t) => t._id === id)[0];
          return player ? of(player) : this.searchPlayer(id);
        }),
      );
    }
    return this.searchPlayer(id);
  }

  editPlayer(id: string, player: Partial<DqPlayer>): Observable<DqPlayer> {
    return this.apiService.put<DqPlayer>(`players/${id}`, player).pipe(
      tap((player_) => {
        if (player_) {
          const { players } = this.store.value;
          players[players.findIndex((t) => t._id === id)] = player_;
          this.store.set(
            'players',
            players,
          );
        }
      }),
      catchError((error) => throwError(error)),
    );
  }

  deletePlayer(id: string): Observable<any> {
    return this.apiService.delete<DqPlayer>(`players/${id}`).pipe(
      tap(() => {
        const { questions } = this.store.value;
        delete questions[id];
        this.store.set('questions', questions);
        const { players } = this.store.value;
        this.store.set('players', players.filter((t) => t._id !== id));
      }),
    );
  }

  private searchPlayer(id: string): Observable<DqPlayer> {
    return this.apiService.get<DqPlayer>(`player/${id}`).pipe(
      tap((players) => this.store.set(
        'players', this.store.value.players ? [players].concat(this.store.value.players) : [players],
      )),
    );
  }
}
