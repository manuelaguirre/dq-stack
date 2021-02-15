import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import {
  catchError, map, mergeMap,
} from 'rxjs/operators';
import { DqPlayer } from '../../../shared/models/dq-player';
import { DqBackOfficeActions } from '../actions';
import { DqPlayerAdapter } from '../adapters/players.adapter';

@Injectable()
export class PlayerEffects {
  constructor(
    private action$: Actions,
    private adapter: DqPlayerAdapter,
  ) {}

  GetPlayers$: Observable<Action> = createEffect(() => this.action$.pipe(
    ofType(DqBackOfficeActions.DQ_GET_PLAYERS),
    mergeMap(() => this.adapter.getPlayers().pipe(
      map((players: DqPlayer[]) => new DqBackOfficeActions.GetPlayersSuccessAction(players)),
      catchError((error: Error) => of(new DqBackOfficeActions.GetPlayersErrorAction(error))),
    )),
  ));

  GetPlayer$: Observable<Action> = createEffect(() => this.action$.pipe(
    ofType(DqBackOfficeActions.DQ_GET_PLAYER),
    mergeMap((action: DqBackOfficeActions.GetPlayerAction) => this.adapter.getPlayer(action.id).pipe(
      map((player: DqPlayer) => new DqBackOfficeActions.GetPlayerSuccessAction(action.id, player)),
      catchError((error: Error) => of(new DqBackOfficeActions.GetPlayerErrorAction(action.id, error))),
    )),
  ));

  // EditPlayer$: Observable<Action> = createEffect(() => this.action$.pipe(
  //   ofType(DqBackOfficeActions.EditPlayerAction),
  //   mergeMap((action) => this.adapter.editPlayer(action.playerId, action.player).pipe(
  //     map((player: DqPlayer) => DqBackOfficeActions.SuccessEditPlayerAction({ player })),
  //     catchError((error: Error) => of(DqBackOfficeActions.ErrorEditPlayerAction({ error, playerId: action.playerId }))),
  //   )),
  // ));

  // CreatePlayer$: Observable<Action> = createEffect(() => this.action$.pipe(
  //   ofType(DqBackOfficeActions.CreatePlayerAction),
  //   mergeMap((action) => this.adapter.createPlayer(action.player).pipe(
  //     map((player: DqPlayer) => DqBackOfficeActions.SuccessCreatePlayerAction({ player })),
  //     catchError((error: Error) => of(DqBackOfficeActions.ErrorCreatePlayerAction({ error, playerId: 'new' }))),
  //   )),
  // ));

  // DeletePlayer$: Observable<Action> = createEffect(() => this.action$.pipe(
  //   ofType(DqBackOfficeActions.DeletePlayerAction),
  //   mergeMap((action) => this.adapter.deletePlayer(action.playerId).pipe(
  //     map(() => DqBackOfficeActions.SuccessDeletePlayerAction({ playerId: action.playerId })),
  //     catchError((error: Error) => of(DqBackOfficeActions.ErrorDeletePlayerAction({
  //       error, playerId: action.playerId,
  //     }))),
  //   )),
  // ));
}
