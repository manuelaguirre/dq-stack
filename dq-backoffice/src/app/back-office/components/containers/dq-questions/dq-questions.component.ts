import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { DqQuestion } from '../../../../shared/models/dq-questions';
import { Observable, throwError, Subscription } from 'rxjs';
import { BackofficeService } from '../../shared/services/backoffice.service';
import { tap, switchMap, catchError } from 'rxjs/operators';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { DqTheme } from '../../../../shared/models/dq-theme';
import { Router } from '@angular/router';
import { SnackBarService } from '../../../../shared/services/snack-bar.service';

@Component({
  selector: 'dq-questions',
  templateUrl: 'dq-questions.component.html'
})

export class DqQuestionsComponent implements OnInit, OnDestroy {
  questions$: Observable<DqQuestion[]> = null;

  loading = false;

  displayedColumns: string[] = ['theme', 'text', 'edit', 'delete'];

  dataSource: MatTableDataSource<DqQuestion> = null;

  theme$: Observable<DqTheme> = this.backOfficeService.getSelectedTheme();

  @ViewChild(MatSort) sort: MatSort;

  subscriptions: Subscription[] = [];

  constructor(
    private backOfficeService: BackofficeService,
    public router: Router,
    private snackBarService: SnackBarService,
  ) { }

  ngOnInit(): void {
    this.loading = true;
    this.questions$ = this.backOfficeService.getThemeQuestions().pipe(
      tap((questions) => {
        this.dataSource = new MatTableDataSource(questions);
        setTimeout(() => {
          this.listenSort();
        }, 1000);
      }),
      tap(() => {
        this.loading = false;
      }),
    );
  }

  listenSort(): void {
    this.sort.disableClear = true;
    this.dataSource.sort = this.sort;
    this.dataSource.sortingDataAccessor = (data: any, sortHeaderId: string): string => {
      if (typeof data[sortHeaderId] === 'string') {
        return data[sortHeaderId].toLocaleLowerCase();
      }
      return data[sortHeaderId];
    };
  }

  deleteQuestion(question: DqQuestion, event: Event) {
    event.stopPropagation();
    this.subscriptions.push(
      this.snackBarService.showMessage('Are you sure to want to delete this question?', 'Yes').onAction()
      .pipe(
        switchMap(() => this.backOfficeService.deleteQuestion(question)),
        tap((question) => {
          this.snackBarService.showMessage('Question deleted successfully');
          // this.dataSource.data = this.dataSource.data.filter((q) => q._id !== q._id);
        }),
        catchError((e) => {
          this.snackBarService.showError(
            'Error: ' + (e && e.message ? e.message : 'unknown')
          );
          return throwError(e);
        }),
      ).subscribe()
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }
}
