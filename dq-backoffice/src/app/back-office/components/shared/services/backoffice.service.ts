import { Injectable } from '@angular/core';
import { ApiService } from '../../../../shared/services/api.service';
import { DqTheme } from '../../../../shared/models/dq-theme';
import { Observable } from 'rxjs';
import { DqQuestion } from '../../../../shared/models/dq-questions';
import { Store } from '../../../../store';
import { tap } from 'rxjs/operators';

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
    console.log(this.store.value.themes);
    if (this.store.value.themes) {
      return this.store.select<DqTheme[]>('themes').pipe(
        tap((questions) => console.log(questions)),
      );
    }
    return this.apiService.get<DqTheme[]>('themes').pipe(
      tap((themes) => this.store.set('themes', themes)),
    );
  }

  getQuestions(): Observable<DqQuestion[]> {
    console.log(this.store.value.questions);
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