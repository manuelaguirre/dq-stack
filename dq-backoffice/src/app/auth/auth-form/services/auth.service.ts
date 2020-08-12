/* eslint-disable no-undef */
import {
  of, Observable,
} from 'rxjs';
import { Injectable } from '@angular/core';
import { ApiService } from 'src/app/shared/services/api.service';
import { tap } from 'rxjs/operators';
import { Store } from 'src/app/store';
import { Router } from '@angular/router';

@Injectable()
export class AuthService {
  constructor(
    private apiService: ApiService,
    private store: Store,
    private router: Router,
  ) {}

  get authenticated(): Observable<boolean> {
    if (this.store.value.token) {
      return of(true);
    }
    if (localStorage.getItem('token').length) {
      this.store.set('token', localStorage.getItem('token'));
      return of(true);
    }
    return of(false);
  }

  signIn(username: string, password: string): Observable<any> {
    return this.apiService.post('login', { username, password }).pipe(
        tap((res) => {
          if (res.token) {
            this.store.set('token', res.token);
            localStorage.setItem('token', res.token);
            this.router.navigate(['home']);
          }
        }),
    );
  }
}
