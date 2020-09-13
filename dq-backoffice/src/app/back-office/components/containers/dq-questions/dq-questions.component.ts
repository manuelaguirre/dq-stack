import { Component, OnInit, ViewChild } from '@angular/core';
import { DqQuestion } from '../../../../shared/models/dq-questions';
import { Observable } from 'rxjs';
import { BackofficeService } from '../../shared/services/backoffice.service';
import { tap } from 'rxjs/operators';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { DqTheme } from '../../../../shared/models/dq-theme';

@Component({
  selector: 'dq-questions',
  templateUrl: 'dq-questions.component.html'
})

export class DqQuestionsComponent implements OnInit {
  questions$: Observable<DqQuestion[]> = null;

  loading = false;

  displayedColumns: string[] = ['theme', 'text'];

  dataSource: MatTableDataSource<DqQuestion> = null;

  theme$: Observable<DqTheme> = this.backOfficeService.getSelectedTheme();

  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private backOfficeService: BackofficeService,
  ) { }

  ngOnInit(): void {
    this.loading = true;
    this.questions$ = this.backOfficeService.getThemeQuestions().pipe(
      tap((questions) => {
        this.dataSource = new MatTableDataSource(questions);
      }),
      tap(() => {
        this.loading = false;
      }),
    );
  }
}
