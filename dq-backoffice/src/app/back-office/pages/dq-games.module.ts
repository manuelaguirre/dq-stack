import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DqGamesComponent } from '../components/containers/dq-games/dq-games.component';
import { DqBackofficeSharedModule } from '../components/shared/dq-backoffice-shared.module';
import { AuthGuardService } from '../../auth/auth-form/services/auth-guard.service';
import {
  DqGameDetailComponent,
} from '../components/containers/dq-games/dq-games-detail/dq-game-detail.component';
import { CanDeactivateForm } from '../components/shared/services/can-deactivate-form.service';

const routes: Routes = [
  {
    path: ':id',
    component: DqGameDetailComponent,
    canActivate: [AuthGuardService],
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
  ],
  providers: [
    CanDeactivateForm,
  ],
})
export class DqGamesModule { }
