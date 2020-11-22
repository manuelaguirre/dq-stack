import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DqMediaComponent } from '../components/containers/dq-media/dq-media.component';
import { DqBackofficeSharedModule } from '../components/shared/dq-backoffice-shared.module';
import { AuthGuardService } from '../../auth/auth-form/services/auth-guard.service';

const routes: Routes = [
  {
    path: '',
    component: DqMediaComponent,
    canActivate: [AuthGuardService],
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    DqBackofficeSharedModule,
  ],
  exports: [],
  declarations: [
    DqMediaComponent,
  ],
  providers: [],
})
export class DqMediaModule { }
