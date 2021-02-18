import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from '../../../environments/environment';
import { DqPlayerAdapter } from './adapters/players.adapter';
import { PlayerEffects } from './effects/players.effects';
import { reducerToken, metaReducers, reducerProvider } from './reducers/index.reducer';
import { DQ_STATE } from './state';

const effects: any[] = [
  PlayerEffects,
];

@NgModule({
  imports: [
    StoreModule.forRoot({}),
    StoreModule.forFeature(DQ_STATE, reducerToken, { metaReducers }),
    EffectsModule.forRoot(effects),
    StoreDevtoolsModule.instrument({ maxAge: 25, logOnly: environment.production }),
  ],
  providers: [
    DqPlayerAdapter,
    reducerProvider,
  ],
})
export class BackOfficeStoreModule { }
