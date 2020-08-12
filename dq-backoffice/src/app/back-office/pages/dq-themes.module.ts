import { NgModule } from '@angular/core';
import { DqThemesComponent } from '../components/containers/dq-themes/dq-themes.component';
import { DqNewThemeComponent } from '../components/containers/dq-themes/dq-new-theme/dq-new-theme.component';
import { RouterModule, Routes } from '@angular/router';
import { DqBackofficeSharedModule } from '../components/shared/dq-backoffice-shared.module';
import { CommonModule } from '@angular/common';

const routes: Routes = [
  {
    path: 'new',
    component: DqNewThemeComponent,
  },
  {
    path: '',
    component: DqThemesComponent,
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
    DqNewThemeComponent,
  ],
  providers: [],
})
export class DqThemesModule { }
