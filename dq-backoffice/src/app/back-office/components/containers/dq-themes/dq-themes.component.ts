import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Observable, Subscription, throwError } from 'rxjs';
import { DqTheme } from '../../../../shared/models/dq-theme';
import { BackofficeService } from '../../shared/services/backoffice.service';
import { tap, catchError, switchMap } from 'rxjs/operators';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { SnackBarService } from '../../../../shared/services/snack-bar.service';

@Component({
  selector: 'dq-themes',
  templateUrl: 'dq-themes.component.html'
})

export class DqThemesComponent implements OnInit, OnDestroy {
  themes$: Observable<DqTheme[]> = null;

  loading = false;

  displayedColumns: string[] = ['name', 'description', 'edit', 'delete'];
  displayedColumnsPrivate: string[] = ['name', 'description', 'companyName','companySubName', 'edit', 'delete'];

  loadingExcel = false;

  dataSource: MatTableDataSource<DqTheme> = null;
  dataSourcePrivate: MatTableDataSource<DqTheme> = null;

  subscriptions: Subscription[] = [];

  errors: string[] = [];

  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private backOfficeService: BackofficeService,
    public router: Router,
    private snackbarService: SnackBarService,
  ) {}

  ngOnInit(): void {
    this.loading = true;
    this.themes$ = this.backOfficeService.getThemes().pipe(
      tap(() => this.loading = false),
      tap((themes) => {
        const privateThemes = themes.filter((t) => !t.isPublic);
        const publicThemes = themes.filter((t) => t.isPublic);
        this.dataSource = new MatTableDataSource(publicThemes);
        this.dataSourcePrivate = new MatTableDataSource(privateThemes);
        setTimeout(() => {
          this.listenSort();
        }, 1000);
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

  onFileInput(event: any) {
    this.loadingExcel = true;
    const file = event.target.files[0];
    this.errors = [];
    if ((file as File).type.includes('csv') || (file as File).type.includes('sheet')) {
      this.subscriptions.push(
        this.backOfficeService.massiveImport(file).pipe(
          tap((questions) => {
            console.log(questions);
            this.loadingExcel = false;
            location.reload();
          }),
          catchError((e) => {
            (e.error as string[]).forEach((error) => this.errors.push(error))
            this.snackbarService.showError(
              'Error: ' + (e && e.message ? e.message : 'unknown')
            );
            this.loadingExcel = false;
            return throwError(e);
          }),
        ).subscribe(),
      );
      return;
    }
    this.subscriptions.push(
      this.snackbarService.showError('The file must have a .CSV extension')
      .afterOpened()
      .subscribe(() => this.loadingExcel = false),
    );
  }

  deleteTheme(themeId: string, event: Event) {
    event.stopPropagation();
    this.subscriptions.push(
      this.snackbarService.showMessage('Are you sure to want to delete this theme?', 'Yes').onAction()
      .pipe(
        switchMap(() => this.backOfficeService.deleteTheme(themeId)),
        tap((theme) => {
          this.snackbarService.showMessage('Theme deleted successfully');
        }),
        catchError((e) => {
          this.snackbarService.showError(
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
