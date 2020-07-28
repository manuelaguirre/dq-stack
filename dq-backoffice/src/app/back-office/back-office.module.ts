import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { BackOficeComponent } from './back-office.component';
import { AuthGuardService } from '../auth/auth-form/services/auth-guard.service';
import { AuthModule } from '../auth/auth.module';

export const routes: Routes = [
  {
    path: '',
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'portal' },
      {
        path: 'portal',
        component: BackOficeComponent,
        canActivate: [ AuthGuardService ],
      },
    ]
  }
]

@NgModule({
  declarations: [
    BackOficeComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
  ],
  exports: [],
  providers: []
})
export class BackOfficeModule {}
