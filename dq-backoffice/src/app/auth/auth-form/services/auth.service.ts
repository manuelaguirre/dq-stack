/* eslint-disable no-undef */
import {
  of, Observable,
} from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable()
export class AuthService {
  get authenticated(): Observable<boolean> {
    console.log('get authenticated');
    return of(true)
  }

  signIn(user: string, pass: string): Observable<any> {
    // TODO: sign in
    return of(true);
  }
}
