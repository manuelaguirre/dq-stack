import {
  Component, OnInit, Input, OnDestroy,
} from '@angular/core';
import { Subscription, throwError } from 'rxjs';
import { SnackBarService } from 'src/app/shared/services/snack-bar.service';
import { tap, catchError } from 'rxjs/operators';
import { ApiService } from 'src/app/shared/services/api.service';
import { BackofficeService } from '../services/backoffice.service';
import { DqQuestion } from '../../../../shared/models/dq-questions';

@Component({
  selector: 'dq-image-handler',
  templateUrl: './dq-image-handler.component.html',
})

export class DqImageHandlerComponent implements OnInit, OnDestroy {
  @Input() question: DqQuestion = null;

  loadingFile = false;

  subscriptions: Subscription[] = [];

  constructor(
    private backOfficeService: BackofficeService,
    private snackBarService: SnackBarService,
    public apiService: ApiService,
  ) { }

  ngOnInit() { }

  onFileInput(event: any) {
    this.loadingFile = true;
    const file = event.target.files[0];
    console.log((file as File).type);
    if (
      (file as File).type.includes('png')
      || (file as File).type.includes('jpg')
      || (file as File).type.includes('JPG')
      || (file as File).type.includes('PNG')
      || (file as File).type.includes('jpeg')
    ) {
      this.subscriptions.push(
        this.backOfficeService.uploadImage(file, this.question).pipe(
          tap((question) => {
            console.log(question);
            this.question = question;
            this.loadingFile = false;
          }),
          catchError((e) => {
            this.snackBarService.showError(
              `Error: ${e && e.message ? e.message : 'unknown'}`,
            );
            this.loadingFile = false;
            return throwError(e);
          }),
        ).subscribe(),
      );
      return;
    }
    this.subscriptions.push(
      this.snackBarService.showError('Not image file')
        .afterOpened()
        .subscribe(() => this.loadingFile = false),
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }
}
