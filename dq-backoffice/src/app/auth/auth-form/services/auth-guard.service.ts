import { Injectable } from '@angular/core';
import {
  CanActivate, Router,
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
    private router: Router,
  ) {}

  canActivate(): Observable<boolean> | boolean {
    return this.auth.authenticated.pipe(
      switchMap((value) => {
        if (value) {
          return of(true);
        }
        this.router.navigate(['auth/login']);
        return of(false);
      }),
    );
  }
}
