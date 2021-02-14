import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';

import { DqGamesComponent } from '../components/containers/dq-games/dq-games.component';
import { DqBackofficeSharedModule } from '../components/shared/dq-backoffice-shared.module';
import {
  DqGameDetailComponent,
} from '../components/containers/dq-games/dq-games-detail/dq-game-detail.component';
import { DqGameResultsComponent } from '../components/containers/dq-games/dq-games-results/dq-game-results.component';

import { AuthGuardService } from '../../auth/auth-form/services/auth-guard.service';
import { CanDeactivateForm } from '../components/shared/services/can-deactivate-form.service';
import { DqPlayedGameGuard } from '../components/containers/dq-games/dq-played-game.service';

const routes: Routes = [
  {
    path: ':id',
    component: DqGameDetailComponent,
    canActivate: [AuthGuardService, DqPlayedGameGuard],
    canDeactivate: [CanDeactivateForm],
  },
  {
    path: ':id/results',
    component: DqGameResultsComponent,
    canActivate: [AuthGuardService, DqPlayedGameGuard],
    canDeactivate: [CanDeactivateForm],
  },
  {
    path: '',
    component: DqGamesComponent,
    canActivate: [AuthGuardService],
  },
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    DqBackofficeSharedModule,
  ],
  exports: [],
  declarations: [
    DqGamesComponent,
    DqGameDetailComponent,
    DqGameResultsComponent,
  ],
  providers: [
    CanDeactivateForm,
    DqPlayedGameGuard,
  ],
})
export class DqGamesModule { }
