import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { DqPlayerAdapter } from './adapters/players.adapter';
import { PlayerEffects } from './effects/players.effects';
import { reducers, metaReducers } from './reducers/index.reducer';

const effects: any[] = [
  PlayerEffects,
];

@NgModule({
  imports: [
    StoreModule.forRoot(reducers, { metaReducers }),
    EffectsModule.forRoot(effects),
  ],
  providers: [
    DqPlayerAdapter,
  ],
})
export class BackOfficeStoreModule { }
