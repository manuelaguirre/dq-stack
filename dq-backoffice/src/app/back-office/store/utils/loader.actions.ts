/* eslint-disable max-classes-per-file */
import { Action } from '@ngrx/store';

export type DqLoaderAllMeta = 'DqLoadAll' | 'DqoadAllSuccess' | 'DqLoadAllError';

export type DqLoaderOneMeta = 'DqLoadOne' | 'DqLoadOneSuccess' | 'DqLoadOneError';

export type DqLoaderMeta = DqLoaderAllMeta | DqLoaderOneMeta;

export interface DqLoaderAction extends Action {
  readonly payload?: any;
  readonly meta?: DqLoaderMeta;
  type: string;
}

export class DqLoadAllLoadAction implements DqLoaderAction {
  meta: DqLoaderAllMeta = 'DqLoadAll';

  type = '';

  constructor(type: string) {
    this.type = type;
  }
}

export class DqLoadAllSuccessAction<T> implements DqLoaderAction {
  meta: DqLoaderAllMeta = 'DqoadAllSuccess';

  type = '';

  constructor(type: string, public payload: T[]) {
    this.type = type;
  }
}

export class DqLoadAllFailAction implements DqLoaderAction {
  meta: DqLoaderAllMeta = 'DqLoadAllError';

  type = '';

  constructor(type: string, public payload: Error) {
    this.type = type;
  }
}

export class DqLoadOneLoadAction implements DqLoaderAction {
  meta: DqLoaderOneMeta = 'DqLoadOne';

  type = '';

  constructor(type: string, public id: string) {
    this.type = type;
  }
}

export class DqLoadOneSuccessAction<T> implements DqLoaderAction {
  meta: DqLoaderOneMeta = 'DqLoadOneSuccess';

  type = '';

  constructor(type: string, public id: string, public payload: T) {
    this.type = type;
  }
}

export class DqLoadOneFailAction implements DqLoaderAction {
  meta: DqLoaderAllMeta = 'DqLoadAllError';

  type = '';

  constructor(type: string, public id: string, public error: Error) {
    this.type = type;
  }
}
