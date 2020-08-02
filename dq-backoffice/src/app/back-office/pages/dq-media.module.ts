import { NgModule } from '@angular/core';
import { DqMediaComponent } from '../components/containers/dq-media/dq-media.component';
import { RouterModule, Routes } from '@angular/router';
import { DqBackofficeSharedModule } from '../components/shared/dq-backoffice-shared.module';

const routes: Routes = [
  { path: '', component: DqMediaComponent },
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
