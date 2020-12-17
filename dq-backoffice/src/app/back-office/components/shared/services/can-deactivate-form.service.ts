import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { SnackBarService } from '../../../../shared/services/snack-bar.service';
import {
  DqQuestionDetailComponent,
} from '../../containers/dq-questions/dq-question-detail/dq-question-detail.component';
import {
  DqThemeDetailComponent,
} from '../../containers/dq-themes/dq-theme-detail/dq-theme-detail.component';

@Injectable()
export class CanDeactivateForm implements CanDeactivate<DqQuestionDetailComponent | DqThemeDetailComponent> {
  constructor(private modalService: SnackBarService) {}

  canDeactivate(
    component: DqQuestionDetailComponent | DqThemeDetailComponent,
  ): Observable<boolean> {
    if (!component.detailForm || !component.detailForm.dirty) {
      return of(true);
    }
    return this.modalService.showMessage(
      'You have unsaved values. Are you sure you want to Leave?', 'Yes',
    ).onAction().pipe(map(() => true));
  }
}
