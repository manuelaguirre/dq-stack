import { Injectable } from '@angular/core';
import {
  CanActivate,
} from '@angular/router';
import {
  Observable, of,
} from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable()
export class AuthGuardService implements CanActivate {
  constructor(
    private auth: AuthService,
  ) {}

  canActivate(): Observable<boolean> | boolean {
    return this.auth.authenticated.pipe(
      switchMap((value) => {
        if (value) {
          return of(true);
        }
        return of(false);
      }),
    );
  }
}
