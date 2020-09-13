import { NgModule } from '@angular/core';
import { DqThemesComponent } from '../components/containers/dq-themes/dq-themes.component';
import { DqThemeDetailComponent } from '../components/containers/dq-themes/dq-theme-detail/dq-theme-detail.component';
import { RouterModule, Routes } from '@angular/router';
import { DqBackofficeSharedModule } from '../components/shared/dq-backoffice-shared.module';
import { CommonModule } from '@angular/common';
import { AuthGuardService } from '../../auth/auth-form/services/auth-guard.service';
import { DqThemeResolver } from '../resolvers/dq-theme.resolver';

const routes: Routes = [
  {
    path: ':id',
    canActivate: [ AuthGuardService ],
    resolve: [ DqThemeResolver ],
    children: [
      {
        path: 'questions',
        loadChildren: () => import('./dq-questions.module').then(m => m.DqQuestionsModule),
      },
      {
        path: '',
        component: DqThemeDetailComponent,
      }
    ]
  },
  {
    path: '',
    component: DqThemesComponent,
    canActivate: [ AuthGuardService ],
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
  providers: [
    DqThemeResolver,
  ],
})
export class DqThemesModule { }
