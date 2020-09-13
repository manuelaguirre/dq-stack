import { Injectable } from '@angular/core';
import {
    ActivatedRouteSnapshot, Resolve, RouterStateSnapshot,
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { Store } from '../../store';

@Injectable()
export class DqThemeResolver implements Resolve<boolean> {
  constructor(private store: Store) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    if (route.params['id']) {
      this.store.set('selectedTheme', route.params['id']);
    }
    return of(true);
  }
}