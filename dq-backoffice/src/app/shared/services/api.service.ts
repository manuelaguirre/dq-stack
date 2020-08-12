import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Store } from '../../store';
import { Router } from '@angular/router';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  public URL_API = 'https://dq-server.herokuapp.com/api';
  constructor(
    private http: HttpClient,
    private store: Store,
    private router: Router,
  ) {}

  public get<T>(path: string, params?: {[param: string]: string | string[]}): Observable<T> {
    const headers: HttpHeaders = this.getHeaders();
    return this.http.get<T>(`${this.URL_API}/${path}`, { headers, params }).pipe(
      catchError((error) => {
        console.log(error);
        if (error.status === 401) {
          this.loginError();
        }
        return of(null);
      })
    );
  }

  public post<T>(path: string, body: any): Observable<T> {
    const headers: HttpHeaders = this.getHeaders();
    return this.http.post<T>(`${this.URL_API}/${path}`, body, { headers }).pipe(
      catchError((error) => {
        if (error.status === 401) {
          this.loginError();
        }
        return of(null);
      })
    );
  }

  public delete<T>(path: string, body?: any): Observable<T> {
    const headers: HttpHeaders = this.getHeaders();
    const options = { headers, body };
    return this.http.delete<T>(`${this.URL_API}/${path}`, options).pipe(
      catchError((error) => {
        if (error.status === 401) {
          this.loginError();
        }
        return of(null);
      })
    );
  }

  public put<T>(path: string, body: Partial<T>): Observable<T> {
    const headers: HttpHeaders = this.getHeaders();
    return this.http.put<T>(`${this.URL_API}/${path}`, body, { headers }).pipe(
      catchError((error) => {
        if (error.status === 401) {
          this.loginError();
        }
        return of(null);
      })
    );
  }

  private getHeaders(): HttpHeaders {
    if (this.store.value.token) {
      return new HttpHeaders()
        .set('Content-Type', 'application/json')
        .append('x-auth-token', this.store.value.token);
    }
    return new HttpHeaders().set('Content-Type', 'application/json');
  }

  private loginError() {
    this.store.set('token', null);
    localStorage.removeItem('token');
    this.router.navigate(['auth/login']);
  }
}