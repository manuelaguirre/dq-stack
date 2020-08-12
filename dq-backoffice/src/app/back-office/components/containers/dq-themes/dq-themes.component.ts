import { Component, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { DqTheme } from '../../../../shared/models/dq-theme';
import { BackofficeService } from '../../shared/services/backoffice.service';
import { tap } from 'rxjs/operators';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'dq-themes',
  templateUrl: 'dq-themes.component.html'
})

export class DqThemesComponent implements OnInit {
  themes$: Observable<DqTheme[]> = null;

  loading = false;

  displayedColumns: string[] = ['name', 'description'];

  dataSource: MatTableDataSource<DqTheme> = null;

  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private backOfficeService: BackofficeService,
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
    )
  }
}
