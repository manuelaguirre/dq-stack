import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DqQuestionsComponent } from '../components/containers/dq-questions/dq-questions.component';
import { DqBackofficeSharedModule } from '../components/shared/dq-backoffice-shared.module';
import {
  DqQuestionDetailComponent,
} from '../components/containers/dq-questions/dq-question-detail/dq-question-detail.component';
import { AuthGuardService } from '../../auth/auth-form/services/auth-guard.service';
import { CanDeactivateQuestion } from '../components/shared/services/can-deactivate-question.service';
import { DqImageHandlerModule } from '../components/shared/dq-image-handler/dq-image-handler.module';

const routes: Routes = [
  {
    path: ':id',
    component: DqQuestionDetailComponent,
    canActivate: [AuthGuardService],
    canDeactivate: [CanDeactivateQuestion],
  },
  {
    path: '',
    component: DqQuestionsComponent,
    canActivate: [AuthGuardService],
  },
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    DqBackofficeSharedModule,
    DqImageHandlerModule,
  ],
  exports: [],
  declarations: [
    DqQuestionsComponent,
    DqQuestionDetailComponent,
  ],
  providers: [
    CanDeactivateQuestion,
  ],
})
export class DqQuestionsModule { }
