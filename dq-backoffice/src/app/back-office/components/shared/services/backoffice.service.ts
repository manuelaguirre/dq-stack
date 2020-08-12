import { Injectable } from '@angular/core';
import { ApiService } from '../../../../shared/services/api.service';
import { DqTheme } from '../../../../shared/models/dq-theme';
import { Observable, of, throwError } from 'rxjs';
import { DqQuestion } from '../../../../shared/models/dq-questions';
import { Store } from '../../../../store';
import { tap, map, switchMap, catchError } from 'rxjs/operators';

@Injectable()
export class BackofficeService {
  constructor(
    private apiService: ApiService,
    private store: Store,
  ) { }

  createNewTheme(name: string, description: string): Observable<DqTheme> {
    return this.apiService.post<DqTheme>('themes', { name, description });
  }

  createNewQuestion(question: Partial<DqQuestion>): Observable<DqQuestion> {
    return this.apiService.post<DqQuestion>('questions', { ...question });
  }

  getThemes(): Observable<DqTheme[]> {
    if (this.store.value.themes && this.store.value.themes.length > 1) {
      return this.store.select<DqTheme[]>('themes');
    }
    return this.apiService.get<DqTheme[]>('themes').pipe(
      tap((themes) => this.store.set('themes', themes)),
    );
  }

  getTheme(id: string): Observable<DqTheme> {
    if (this.store.value.themes) {
      return this.store.select<DqTheme[]>('themes').pipe(
        switchMap((themes) => {
          const theme = themes.filter((t) => t._id === id)[0];
          return theme ? of(theme) : this.searchTheme(id);
        }),
      );
    }
    return this.searchTheme(id);
  }

  editTheme(id: string, theme: Partial<DqTheme>): Observable<DqTheme> {
    return this.apiService.put<DqTheme>(`themes/${id}`, theme).pipe(
      tap((theme) => {
        if (theme) {
          const themes = this.store.value.themes;
          themes[themes.findIndex((t) => t._id === id)] = theme;
          this.store.set(
            'themes',
            themes,
          );
        }
      }),
      catchError((error) => throwError(error)),
    );
  }

  private searchTheme(id: string): Observable<DqTheme> {
    return this.apiService.get<DqTheme>(`themes/${id}`).pipe(
      tap((theme) => this.store.set(
        'themes', this.store.value.themes ? [theme].concat(this.store.value.themes) : [theme],
      )),
    );
  }

  getQuestions(): Observable<DqQuestion[]> {
    if (this.store.value.questions) {
      return this.store.select<DqQuestion[]>('questions').pipe(
        tap((questions) => console.log(questions)),
      );
    }
    return this.apiService.get<DqQuestion[]>('questions').pipe(
      tap((questions) => this.store.set('questions', questions)),
    );
  }
  
}