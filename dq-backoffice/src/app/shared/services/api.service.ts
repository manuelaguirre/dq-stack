import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { Store } from '../../store';

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

  public get<T>(path: string, params?: {[param: string]: string | string[];}): Observable<T> {
    const headers: HttpHeaders = this.getHeaders();
    return this.http.get<T>(`${this.URL_API}/${path}`, { headers, params }).pipe(
      catchError((error) => {
        console.log(error);
        if (error.status === 401) {
          this.loginError();
        }
        return throwError(error);
      }),
    );
  }

  public post<T>(path: string, body: any): Observable<T> {
    const headers: HttpHeaders = this.getHeaders();
    return this.http.post<T>(`${this.URL_API}/${path}`, body, { headers }).pipe(
      catchError((error) => {
        if (error.status === 401) {
          this.loginError();
        }
        return throwError(error);
      }),
    );
  }

  public postCSV(path: string, body: Blob): Observable<any> {
    const headers: HttpHeaders = this.getHeaders('text/csv');
    return this.http.post(`${this.URL_API}/${path}`, body, { headers }).pipe(
      catchError((error) => {
        if (error.status === 401) {
          this.loginError();
        }
        return throwError(error);
      }),
    );
  }

  public postImage(path: string, formData: FormData): Observable<any> {
    const headers = new HttpHeaders().append('x-auth-token', this.store.value.token);
    return this.http.post(`${this.URL_API}/${path}`, formData, { headers }).pipe(
      catchError((error) => {
        if (error.status === 401) {
          this.loginError();
        }
        return throwError(error);
      }),
    );
  }

  public putImage(path: string, formData: FormData): Observable<any> {
    const headers = new HttpHeaders().append('x-auth-token', this.store.value.token);
    return this.http.put(`${this.URL_API}/${path}`, formData, { headers }).pipe(
      catchError((error) => {
        if (error.status === 401) {
          this.loginError();
        }
        return throwError(error);
      }),
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
        return throwError(error);
      }),
    );
  }

  public put<T>(path: string, body: Partial<T>): Observable<T> {
    const headers: HttpHeaders = this.getHeaders();
    return this.http.put<T>(`${this.URL_API}/${path}`, body, { headers }).pipe(
      catchError((error) => {
        if (error.status === 401) {
          this.loginError();
        }
        return throwError(error);
      }),
    );
  }

  private getHeaders(extension?: string): HttpHeaders {
    if (this.store.value.token) {
      return new HttpHeaders()
        .set('Content-Type', extension || 'application/json')
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
