import { Injectable } from '@angular/core';
import {
    ActivatedRouteSnapshot, Router, Resolve, RouterStateSnapshot,
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { DQQuestion } from '../../shared/models/dq-questions';
import { DqTheme } from '../../shared/models/dq-theme';
import { ApiService } from 'src/app/shared/services/api.service';

@Injectable()
export class DqBackOfficeResolver implements Resolve<Partial<DQQuestion>[] | Partial<DqTheme>[]> {
  constructor(
    private apiService: ApiService,
  ) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Partial<DQQuestion>[] | Partial<DqTheme>[]> {
    console.log({route, state});
    if (state.url.includes('themes')) {
      return this.apiService.get<DqTheme[]>('themes');
    }
    if (state.url.includes('questions')) {
      return this.apiService.get<DQQuestion[]>('questions');
    }
    return of(null);
  }
}
