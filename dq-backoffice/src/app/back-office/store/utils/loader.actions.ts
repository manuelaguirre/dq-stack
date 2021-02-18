/* eslint-disable max-classes-per-file */
import { Action } from '@ngrx/store';

export const DQ_ENTITY_LOAD_ACTION = '[DQENTITY] LOAD';
export const DQ_ENTITY_FAIL_ACTION = '[DQENTITY] LOAD FAIL';
export const DQ_ENTITY_SUCCESS_ACTION = '[DQENTITY] LOAD SUCCESS';

export type DqLoaderOneMeta =
  typeof DQ_ENTITY_LOAD_ACTION | typeof DQ_ENTITY_FAIL_ACTION | typeof DQ_ENTITY_SUCCESS_ACTION;

export const DQ_ALL_LOAD_ACTION = '[DQALL] LOAD';
export const DQ_ALL_FAIL_ACTION = '[DQALL] LOAD FAIL';
export const DQ_ALL_SUCCESS_ACTION = '[DQALL] LOAD SUCCESS';

export type DqLoaderAllMeta = typeof DQ_ALL_LOAD_ACTION | typeof DQ_ALL_FAIL_ACTION | typeof DQ_ALL_SUCCESS_ACTION;

export type DqLoaderMeta = DqLoaderAllMeta | DqLoaderOneMeta;

/**
 * @property payload: Optional data
 * @property meta: All/entity & Load/success/fail
 * @property type: Id of the action
 */
export interface DqLoaderAction extends Action {
  readonly payload?: any;
  readonly meta?: DqLoaderMeta;
  type: string;
}

export class DqLoadAllLoadAction implements DqLoaderAction {
  meta = DQ_ALL_LOAD_ACTION as DqLoaderAllMeta;

  type = '';

  constructor(type: string) {
    this.type = type;
  }
}

export class DqLoadAllSuccessAction<T> implements DqLoaderAction {
  meta = DQ_ALL_SUCCESS_ACTION as DqLoaderAllMeta;

  type = '';

  constructor(type: string, public payload: T) {
    this.type = type;
  }
}

export class DqLoadAllFailAction implements DqLoaderAction {
  meta = DQ_ALL_FAIL_ACTION as DqLoaderAllMeta;

  type = '';

  constructor(type: string, public payload: Error) {
    this.type = type;
  }
}

export class DqLoadOneLoadAction implements DqLoaderAction {
  meta = DQ_ENTITY_LOAD_ACTION as DqLoaderOneMeta;

  type = '';

  constructor(type: string, public id: string) {
    this.type = type;
  }
}

export class DqLoadOneSuccessAction<T> implements DqLoaderAction {
  meta = DQ_ENTITY_SUCCESS_ACTION as DqLoaderOneMeta;

  type = '';

  constructor(type: string, public id: string, public payload: T) {
    this.type = type;
  }
}

export class DqLoadOneFailAction implements DqLoaderAction {
  meta = DQ_ENTITY_FAIL_ACTION as DqLoaderOneMeta;

  type = '';

  constructor(type: string, public id: string, public error: Error) {
    this.type = type;
  }
}
