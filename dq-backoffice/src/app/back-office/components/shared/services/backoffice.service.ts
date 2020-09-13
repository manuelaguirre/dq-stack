import { Injectable } from '@angular/core';
import { ApiService } from '../../../../shared/services/api.service';
import { DqTheme } from '../../../../shared/models/dq-theme';
import { Observable, of, throwError } from 'rxjs';
import { DqQuestion } from '../../../../shared/models/dq-questions';
import { Store } from '../../../../store';
import { tap, map, switchMap, catchError } from 'rxjs/operators';

@Injectable()
export class BackofficeService {
  allQuestionsSearched = false;

  allThemesSearched = false;
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
    if (this.store.value.themes && this.allThemesSearched) {
      return this.store.select<DqTheme[]>('themes');
    }
    return this.apiService.get<DqTheme[]>('themes').pipe(
      tap((themes) => this.store.set('themes', themes)),
      tap(() => this.allThemesSearched = true),
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
    if (this.store.value.questions && this.allQuestionsSearched) {
      return this.store.select<DqQuestion[]>('questions').pipe(
        tap((questions) => console.log(questions)),
      );
    }
    return this.apiService.get<DqQuestion[]>('questions').pipe(
      tap((questions) => this.store.set('questions', questions)),
      tap(() => this.allQuestionsSearched = true),
    );
  }

  getQuestion(id: string): Observable<DqQuestion> {
    if (this.store.value.questions) {
      return this.store.select<DqQuestion[]>('questions').pipe(
        switchMap((questions) => {
          const question = questions.filter((t) => t._id === id)[0];
          return question ? of(question) : this.searchQuestion(id);
        }),
      );
    }
    return this.searchQuestion(id);
  }

  editQuestion(id: string, question: Partial<DqQuestion>): Observable<DqQuestion> {
    return this.apiService.put<DqQuestion>(`questions/${id}`, question).pipe(
      tap((question) => {
        if (question) {
          const questions = this.store.value.questions;
          questions[questions.findIndex((q) => q._id === id)] = question;
          this.store.set(
            'questions',
            questions,
          );
        }
      }),
      catchError((error) => throwError(error)),
    );
  }

  private searchQuestion(id: string): Observable<DqQuestion> {
    return this.apiService.get<DqQuestion>(`questions/${id}`).pipe(
      tap((question) => this.store.set(
        'questions', this.store.value.questions ? [question].concat(this.store.value.questions) : [question],
      )),
    );
  }
  
}