import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';
import { DQQuestion } from '../../../../shared/models/dq-questions';
import { Observable } from 'rxjs';

@Component({
  selector: 'dq-questions',
  templateUrl: 'dq-questions.component.html'
})

export class DqQuestionsComponent implements OnInit {
  questions$: Observable<DQQuestion[]> = null;

  constructor(
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.questions$ = this.route.data.pipe(
      map((data: {questions: DQQuestion[];}) => data.questions),
    );
  }
}
