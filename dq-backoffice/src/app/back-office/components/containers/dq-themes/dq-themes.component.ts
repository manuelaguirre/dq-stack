import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Observable, Subscription, throwError } from 'rxjs';
import { DqTheme } from '../../../../shared/models/dq-theme';
import { BackofficeService } from '../../shared/services/backoffice.service';
import { tap, catchError } from 'rxjs/operators';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { SnackBarService } from 'src/app/shared/services/snack-bar.service';

@Component({
  selector: 'dq-themes',
  templateUrl: 'dq-themes.component.html'
})

export class DqThemesComponent implements OnInit, OnDestroy {
  themes$: Observable<DqTheme[]> = null;

  loading = false;

  displayedColumns: string[] = ['name', 'description', 'edit'];
  loadingExcel = false;


  dataSource: MatTableDataSource<DqTheme> = null;

  subscriptions: Subscription[] = [];

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
        this.dataSource = new MatTableDataSource(themes);
        setTimeout(() => {
          this.dataSource.sort = this.sort;
        }, 1000);
      }),
    );
  }

  onFileInput(event: any) {
    this.loadingExcel = true;
    const file = event.target.files[0];
    if ((file as File).type.includes('csv') || (file as File).type.includes('sheet')) {
      this.subscriptions.push(
        this.backOfficeService.massiveImport(file).pipe(
          tap((questions) => {
            console.log(questions);
            this.loadingExcel = false;
            location.reload();
          }),
          catchError((e) => {
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
      this.snackbarService.showError('Not CSV file')
      .afterOpened()
      .subscribe(() => this.loadingExcel = false),
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }
}
