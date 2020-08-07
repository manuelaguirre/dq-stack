import { Injectable } from '@angular/core';
import {
    ActivatedRouteSnapshot, Router, Resolve, RouterStateSnapshot,
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { DQQuestion } from '../../shared/models/dq-questions';
import { DqTheme } from '../../shared/models/dq-theme';

@Injectable()
export class DqBackOfficeResolver implements Resolve<Partial<DQQuestion>[] | Partial<DqTheme>[]> {
  constructor() {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Partial<DQQuestion>[] | Partial<DqTheme>[]> {
    console.log({route, state});
    if (state.url.includes('themes')) {
      // TODO: call API
      return of([{ name: 'Theme 1'}]);
    }
    if (state.url.includes('questions')) {
      // TODO: call API
      return of([{ name: 'Question 1'}]);
    }
    return of(null);
  }
}
