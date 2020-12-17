import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DqPlayersComponent } from '../components/containers/dq-players/dq-players.component';
import { DqBackofficeSharedModule } from '../components/shared/dq-backoffice-shared.module';
import { AuthGuardService } from '../../auth/auth-form/services/auth-guard.service';
import {
  DqPlayerDetailComponent,
} from '../components/containers/dq-players/dq-players-detail/dq-player-detail.component';
import { CanDeactivateForm } from '../components/shared/services/can-deactivate-form.service';

const routes: Routes = [
  {
    path: ':id',
    component: DqPlayerDetailComponent,
    canActivate: [AuthGuardService],
    canDeactivate: [CanDeactivateForm],
  },
  {
    path: '',
    component: DqPlayersComponent,
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
    DqPlayersComponent,
    DqPlayerDetailComponent,
  ],
  providers: [
    CanDeactivateForm,
  ],
})
export class DqPlayersModule { }
