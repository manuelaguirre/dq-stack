import { BehaviorSubject, Observable } from 'rxjs';
import { pluck, distinctUntilChanged } from 'rxjs/operators';
import { State } from './state';

const state: State = {
  token: undefined,
  themes: undefined,
  questions: {},
  selectedTheme: undefined,
  players: undefined,
  games: undefined,
};

export class Store {
  private subject = new BehaviorSubject<State>(state);

  private store = this.subject.asObservable().pipe(distinctUntilChanged());

  get value(): State {
    return this.subject.value;
  }

  select<T>(name: string): Observable<T> {
    return this.store.pipe(pluck(name));
  }

  set<T>(name: string, newState: T): void {
    this.subject.next({
      ...this.value, [name]: newState,
    });
  }

  reset(): void {
    this.set('themes', undefined);
    this.set('questions', {});
    this.set('selectedTheme', undefined);
  }
}
