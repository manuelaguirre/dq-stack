import { NgModule } from '@angular/core';
import { DqThemesComponent } from '../components/containers/dq-themes/dq-themes.component';
import { DqThemeDetailComponent } from '../components/containers/dq-themes/dq-theme-detail/dq-theme-detail.component';
import { RouterModule, Routes } from '@angular/router';
import { DqBackofficeSharedModule } from '../components/shared/dq-backoffice-shared.module';
import { CommonModule } from '@angular/common';
import { AuthGuardService } from '../../auth/auth-form/services/auth-guard.service';

const routes: Routes = [
  {
    path: ':id',
    component: DqThemeDetailComponent,
    canActivate: [ AuthGuardService ],
  },
  {
    path: '',
    component: DqThemesComponent,
    canActivate: [ AuthGuardService ],
    // resolve: {
    //   themes: DqBackOfficeResolver
    // }
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
    DqThemesComponent,
    DqThemeDetailComponent,
  ],
  providers: [],
})
export class DqThemesModule { }
