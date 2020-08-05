import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  public URL_API = 'https://dq-server.herokuapp.com/';
  constructor(
    private http: HttpClient,
  ) {}

  public get<T>(path: string, params?: {[param: string]: string | string[]}): Observable<T> {
    const headers: HttpHeaders = this.getHeaders();
    return this.http.get<T>(`${this.URL_API}/${path}`, { headers, params });
  }

  public post<T>(path: string, body: any): Observable<T> {
    const headers: HttpHeaders = this.getHeaders();
    return this.http.post<T>(`${this.URL_API}/${path}`, body, { headers });
  }

  public delete<T>(path: string, body?: any): Observable<T> {
    const headers: HttpHeaders = this.getHeaders();
    const options = { headers, body };
    return this.http.delete<T>(`${this.URL_API}/${path}`, options);
  }

  public put<T>(path: string, body: T): Observable<T> {
    const headers: HttpHeaders = this.getHeaders();
    return this.http.put<T>(`${this.URL_API}/${path}`, body, { headers });
  }

  private getHeaders(): HttpHeaders {
    return new HttpHeaders().set('Content-Type', 'application/json');
  }
}