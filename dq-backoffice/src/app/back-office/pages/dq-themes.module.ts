import { NgModule } from '@angular/core';
import { DqThemesComponent } from '../components/containers/dq-themes/dq-themes.component';
import { RouterModule, Routes } from '@angular/router';
import { DqBackofficeSharedModule } from '../components/shared/dq-backoffice-shared.module';
import { CommonModule } from '@angular/common';

const routes: Routes = [
  { path: '', component: DqThemesComponent },
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
  ],
  providers: [],
})
export class DqThemesModule { }
