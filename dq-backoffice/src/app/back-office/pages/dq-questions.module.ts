import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DqQuestionsComponent } from '../components/containers/dq-questions/dq-questions.component';
import { DqBackofficeSharedModule } from '../components/shared/dq-backoffice-shared.module';
import {
  DqQuestionDetailComponent,
} from '../components/containers/dq-questions/dq-question-detail/dq-question-detail.component';
import { AuthGuardService } from '../../auth/auth-form/services/auth-guard.service';
import { CanDeactivateForm } from '../components/shared/services/can-deactivate-form.service';
import { DqImageHandlerModule } from '../components/shared/dq-image-handler/dq-image-handler.module';

const routes: Routes = [
  {
    path: ':id',
    component: DqQuestionDetailComponent,
    canActivate: [AuthGuardService],
    canDeactivate: [CanDeactivateForm],
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
    CanDeactivateForm,
  ],
})
export class DqQuestionsModule { }
