import { Component, OnInit } from '@angular/core';
import { DqQuestion } from '../../../../shared/models/dq-questions';
import { Observable } from 'rxjs';
import { BackofficeService } from '../../shared/services/backoffice.service';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'dq-questions',
  templateUrl: 'dq-questions.component.html'
})

export class DqQuestionsComponent implements OnInit {
  questions$: Observable<DqQuestion[]> = null;

  loading = false;

  constructor(
    private backOfficeService: BackofficeService,
  ) { }

  ngOnInit(): void {
    this.loading = true;
    this.questions$ = this.backOfficeService.getQuestions().pipe(
      tap(() => this.loading = false),
    );
  }
}
