import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DqQuestionsComponent } from '../components/containers/dq-questions/dq-questions.component';
import { DqBackofficeSharedModule } from '../components/shared/dq-backoffice-shared.module';
import { CommonModule } from '@angular/common';
import { DqQuestionDetailComponent } from '../components/containers/dq-questions/dq-question-detail/dq-question-detail.component';
import { AuthGuardService } from '../../auth/auth-form/services/auth-guard.service';

const routes: Routes = [
  {
    path: ':id',
    component: DqQuestionDetailComponent,
    canActivate: [ AuthGuardService ],
  },
  {
    path: '',
    component: DqQuestionsComponent,
    canActivate: [ AuthGuardService ],
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
    DqQuestionDetailComponent,
  ],
  providers: [],
})
export class DqQuestionsModule { }
