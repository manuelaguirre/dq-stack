import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { BackOficeComponent } from './back-office.component';
import { AuthGuardService } from '../auth/auth-form/services/auth-guard.service';
import { DqBackOfficeResolver } from './resolvers/dq-backoffice-page.resolver';
import { SharedModule } from '../shared/shared.module';
import { DqBackofficeSharedModule } from './components/shared/dq-backoffice-shared.module';

export const routes: Routes = [
  {
    path: '',
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'portal' },
      {
        path: 'portal',
        component: BackOficeComponent,
        canActivate: [AuthGuardService],
      },
      {
        path: 'themes',
        loadChildren: () => import('./pages/dq-themes.module').then((m) => m.DqThemesModule),
      },
      {
        path: 'players',
        loadChildren: () => import('./pages/dq-players.module').then((m) => m.DqPlayersModule),
      },
      {
        path: 'media',
        loadChildren: () => import('./pages/dq-media.module').then((m) => m.DqMediaModule),
      },
      {
        path: 'games',
        loadChildren: () => import('./pages/dq-games.module').then((m) => m.DqGamesModule),
      },
      { path: '**', redirectTo: 'portal' },
    ],
  },
];

@NgModule({
  declarations: [
    BackOficeComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    DqBackofficeSharedModule,
    RouterModule.forChild(routes),
  ],
  exports: [],
  providers: [
    DqBackOfficeResolver,
  ],
})
export class BackOfficeModule {}
