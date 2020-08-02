import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DqQuestionsComponent } from '../components/containers/dq-questions/dq-questions.component';
import { DqBackofficeSharedModule } from '../components/shared/dq-backoffice-shared.module';

const routes: Routes = [
  { path: '', component: DqQuestionsComponent },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    DqBackofficeSharedModule,
  ],
  exports: [],
  declarations: [
    DqQuestionsComponent,
  ],
  providers: [],
})
export class DqQuestionsModule { }
