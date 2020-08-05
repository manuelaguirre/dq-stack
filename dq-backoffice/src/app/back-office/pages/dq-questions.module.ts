import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DqQuestionsComponent } from '../components/containers/dq-questions/dq-questions.component';
import { DqBackofficeSharedModule } from '../components/shared/dq-backoffice-shared.module';
import { DqBackOfficeResolver } from '../resolvers/dq-backoffice-page.resolver';
import { CommonModule } from '@angular/common';

const routes: Routes = [
  {
    path: '',
    component: DqQuestionsComponent,
    resolve: {
      questions: DqBackOfficeResolver
    }
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
  ],
  providers: [],
})
export class DqQuestionsModule { }
