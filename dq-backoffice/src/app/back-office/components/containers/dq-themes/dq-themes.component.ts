import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { DqTheme } from '../../../../shared/models/dq-theme';
import { BackofficeService } from '../../shared/services/backoffice.service';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'dq-themes',
  templateUrl: 'dq-themes.component.html'
})

export class DqThemesComponent implements OnInit {
  themes$: Observable<DqTheme[]> = null;

  loading = false;

  constructor(
    private backOfficeService: BackofficeService,
  ) {}

  ngOnInit(): void {
    this.loading = true;
    this.themes$ = this.backOfficeService.getThemes().pipe(
      tap(() => this.loading = false),
    );
  }
}
