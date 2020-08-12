import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DqQuestionsComponent } from '../components/containers/dq-questions/dq-questions.component';
import { DqBackofficeSharedModule } from '../components/shared/dq-backoffice-shared.module';
import { CommonModule } from '@angular/common';
import { DqNewQuestionComponent } from '../components/containers/dq-questions/dq-new-question/dq-new-question.component';

const routes: Routes = [
  {
    path: 'new',
    component: DqNewQuestionComponent,
  },
  {
    path: '',
    component: DqQuestionsComponent,
    // resolve: {
    //   questions: DqBackOfficeResolver
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
    DqQuestionsComponent,
    DqNewQuestionComponent,
  ],
  providers: [],
})
export class DqQuestionsModule { }
