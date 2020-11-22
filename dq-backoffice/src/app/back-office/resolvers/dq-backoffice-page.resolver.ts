import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot, Resolve, RouterStateSnapshot,
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { DqQuestion } from '../../shared/models/dq-questions';
import { DqTheme } from '../../shared/models/dq-theme';
import { BackofficeService } from '../components/shared/services/backoffice.service';

@Injectable()
export class DqBackOfficeResolver implements Resolve<Partial<DqQuestion>[] | Partial<DqTheme>[]> {
  constructor(
    private backOfficeService: BackofficeService,
  ) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Partial<DqQuestion>[] | Partial<DqTheme>[]> {
    if (state.url.includes('themes')) {
      return this.backOfficeService.getThemes();
    }
    if (state.url.includes('questions')) {
      return this.backOfficeService.getThemeQuestions();
    }
    return of(null);
  }
}
