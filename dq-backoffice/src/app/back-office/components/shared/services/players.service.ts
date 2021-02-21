import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import {
  filter, map, tap,
} from 'rxjs/operators';
import { Store, select } from '@ngrx/store';
import { DqPlayer } from '../../../../shared/models/dq-player';
import { ApiService } from '../../../../shared/services/api.service';
import { DqBackOfficeActions } from '../../../store/actions';
import { getAllPlayersState, getPlayerState } from '../../../store/selectors/players.selector';
import { DqEntity } from '../../../store/state';

@Injectable()
export class PlayersService {
  allPlayersSearched = false;

  constructor(
    private apiService: ApiService,
    private store: Store,
  ) { }

  loadPlayers(): void {
    this.store.dispatch(new DqBackOfficeActions.GetPlayersAction());
  }

  loadPlayer(playerId: string): void {
    this.store.dispatch(new DqBackOfficeActions.GetPlayerAction(playerId));
  }

  getPlayers(): Observable<DqPlayer[]> {
    return this.store.pipe(
      select(getAllPlayersState),
      tap((state) => {
        const alreadyLoaded = state.loading || state.success || state.error;
        // Load all if never loaded
        if (!alreadyLoaded) {
          this.loadPlayers();
        }
      }),
      map((state) => state.value),
    );
  }

  getPlayer(id: string): Observable<DqPlayer> {
    return this.store.pipe(
      select(getPlayerState(id)),
      tap((state) => {
        const alreadyLoaded = state && (state.loading || state.success || state.error);
        // Load all if never loaded
        if (!alreadyLoaded) {
          this.loadPlayer(id);
        }
      }),
      filter((state) => !!state),
      map((state) => state.value),
    );
  }

  getPlayerEntityState(id: string): Observable<DqEntity<DqPlayer>> {
    return this.store.pipe(
      select(getPlayerState(id)),
      tap((state) => {
        const alreadyLoaded = state && (state.loading || state.success || state.error);
        // Load all if never loaded
        if (!alreadyLoaded) {
          this.loadPlayer(id);
        }
      }),
      filter((state) => !!state && (state.success || !!state.error)),
    );
  }

  createNewPlayer(player: Partial<DqPlayer>): Observable<DqEntity<DqPlayer>> {
    // Set a custom password for future log in
    const customPassword = 'defiquizz1234';
    this.store.dispatch(new DqBackOfficeActions.CreatePlayerAction(
      'new',
      { ...player, password: customPassword },
    ));
    return this.store.pipe(
      select(getPlayerState('new')),
      map((state) => state),
      filter((state) => !!state && (state.success || !!state.error)),
    );
  }

  editPlayer(playerId: string, player: Partial<DqPlayer>): Observable<DqEntity<DqPlayer>> {
    this.store.dispatch(new DqBackOfficeActions.EditPlayerAction(
      playerId, player,
    ));
    return this.store.pipe(
      select(getPlayerState(playerId)),
      map((state) => {
        console.log(state);
        return state;
      }),
      filter((state) => !!state && (state.success || !!state.error)),
    );
  }

  deletePlayer(playerId: string): Observable<any> {
    // this.store.dispatch(DqBackOfficeActions.DeletePlayerAction({ playerId }));
    // return this.store.pipe(
    //   select(getPlayerState(playerId)),
    //   map((state) => state),
    //   filter((state) => !!state),
    // );
    return of(null);
  }
}
