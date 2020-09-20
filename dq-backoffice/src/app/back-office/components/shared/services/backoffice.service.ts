import { Injectable } from '@angular/core';
import { ApiService } from '../../../../shared/services/api.service';
import { DqTheme } from '../../../../shared/models/dq-theme';
import { Observable, of, throwError, combineLatest } from 'rxjs';
import { DqQuestion } from '../../../../shared/models/dq-questions';
import { Store } from '../../../../store';
import { tap, switchMap, catchError, filter, map, take } from 'rxjs/operators';

@Injectable()
export class BackofficeService {
  allQuestionsSearched = false;

  allThemesSearched = false;
  constructor(
    private apiService: ApiService,
    private store: Store,
  ) { }

  createNewTheme(name: string, description: string, isPublic: boolean): Observable<DqTheme> {
    return this.apiService.post<DqTheme>('themes', { name, description, isPublic });
  }

  createNewQuestion(question: Partial<DqQuestion>): Observable<DqQuestion> {
    return this.apiService.post<DqQuestion>('questions', { ...question }).pipe(
      tap((question) => {
        const questions = this.store.value.questions;
        if (questions[question.theme]) {
          questions[question.theme].push(question);
        } else {
          questions[question.theme] = [question];
        }
        this.store.set(
          'questions', questions,
        );
      })
    );
  }

  getThemeQuestions(): Observable<DqQuestion[]> {
    return this.store.select<string>('selectedTheme').pipe(
      filter((id) => !!id),
      take(1),
      switchMap((themeId) => {
        if (
          this.store.value.questions && this.store.value.questions[themeId] && this.allQuestionsSearched
        ) {
          return this.store.select<{
              [themeId: string]: DqQuestion[];
          }>('questions').pipe(
            map((questions) => questions[themeId]),
          );
        }
        return this.apiService.get<DqQuestion[]>(`questions?theme=${themeId}`).pipe(
          tap((questions) => {
            const questions_ = this.store.value.questions;
            questions_[themeId] = questions;
            this.store.set('questions', questions_);
            this.allQuestionsSearched = true;
          }),
        );
      })
    )
  }

  getQuestion(id: string): Observable<Partial<DqQuestion>> {
    if (this.store.value.questions) {
      return combineLatest(
        this.store.select<{
          [themeId: string] : Partial<DqQuestion>[];
        }>('questions'),
        this.store.select<string>('selectedTheme'),
      ).pipe(
        filter((data) => !!data[0] && !!data[1]),
        take(1),
        switchMap((data) => {
          if (data[0] && data[0][data[1]]) {
            const question = data[0][data[1]].filter((t) => t._id === id)[0];
            return question ? of(question) : this.searchQuestion(id);
          }
          return this.searchQuestion(id);
        }),
      );
    }
    return this.searchQuestion(id);
  }

  editQuestion(id: string, question: Partial<DqQuestion>): Observable<DqQuestion> {
    return combineLatest(
      this.store.select<string>('selectedTheme'),
      this.apiService.put<DqQuestion>(`questions/${id}`, question),
    ).pipe(
      filter((data) => !!data[0] && !!data[1]),
      take(1),
      tap((data) => {
        const questions = this.store.value.questions;
        const questionsCat = questions[data[0]];
        questionsCat[questionsCat.findIndex((q) => q._id === id)] = question;
        this.store.set(
          'questions',
          questions,
        );
      }),
      map((data) => data[1]),
      catchError((error) => throwError(error)),
    );
  }

  private searchQuestion(id: string): Observable<DqQuestion> {
    return combineLatest(
      this.store.select<string>('selectedTheme'),
      this.apiService.get<DqQuestion>(`questions/${id}`),
    ).pipe(
      filter((data) => !!data[0] && !!data[1]),
      take(1),
      tap((data) => {
        const questions = this.store.value.questions;
        if (questions[data[0]]) {
          questions[data[0]].push(data[1]);
        } else {
          questions[data[0]] = [data[1]];
        }
        this.store.set(
          'questions', questions,
        );
      }),
      map((data) => data[1]),
    );
  }

  deleteQuestion(id: string): Observable<any> {
    return this.apiService.delete<DqQuestion>(`questions/${id}`);
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

  getSelectedTheme(): Observable<DqTheme> {
    return this.store.select<string>('selectedTheme').pipe(
      switchMap((themeID) => this.getTheme(themeID)),
    );
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
  
  massiveImport(file: Blob): Observable<DqQuestion[]> {
    return this.apiService.postFile('massiveImport', file).pipe(
      map((questions) => questions as DqQuestion[]),
      catchError((e) => throwError(e)),
    );
  }
}