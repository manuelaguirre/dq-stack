import { Component, OnInit, ViewChild } from '@angular/core';
import { DqQuestion } from '../../../../shared/models/dq-questions';
import { Observable } from 'rxjs';
import { BackofficeService } from '../../shared/services/backoffice.service';
import { tap, map } from 'rxjs/operators';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'dq-questions',
  templateUrl: 'dq-questions.component.html'
})

export class DqQuestionsComponent implements OnInit {
  questions$: Observable<DqQuestion[]> = null;

  loading = false;

  displayedColumns: string[] = ['theme', 'text'];

  dataSource: MatTableDataSource<DqQuestion> = null;

  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private backOfficeService: BackofficeService,
  ) { }

  ngOnInit(): void {
    this.loading = true;
    this.questions$ = this.backOfficeService.getQuestions().pipe(
      tap((questions) => {
        this.dataSource = new MatTableDataSource(questions);
      }),
      tap(() => {
        this.loading = false;
      }),
    );
  }

  getThemeName(themeId: string): Observable<string> {
    return this.backOfficeService.getTheme(themeId).pipe(
      map((theme) => theme.name),
    );
  }
}
