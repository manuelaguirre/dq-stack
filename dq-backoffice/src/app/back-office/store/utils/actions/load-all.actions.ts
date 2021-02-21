/* eslint-disable max-classes-per-file */
import {
  DqLoaderAction,
  DqLoaderAllMeta,
  DQ_ALL_FAIL_ACTION,
  DQ_ALL_LOAD_ACTION,
  DQ_ALL_SUCCESS_ACTION,
} from './dq-loader.actions';

export class DqLoadAllLoadAction implements DqLoaderAction {
  meta = DQ_ALL_LOAD_ACTION as DqLoaderAllMeta;

  type = '';

  feature = ''

  constructor(type: string, feature: string) {
    this.type = type;
    this.feature = feature;
  }
}

export class DqLoadAllSuccessAction<T> implements DqLoaderAction {
  meta = DQ_ALL_SUCCESS_ACTION as DqLoaderAllMeta;

  type = '';

  feature = ''

  constructor(type: string, feature: string, public payload: T) {
    this.type = type;
    this.feature = feature;
  }
}

export class DqLoadAllFailAction implements DqLoaderAction {
  meta = DQ_ALL_FAIL_ACTION as DqLoaderAllMeta;

  type = '';

  feature = ''

  constructor(type: string, feature: string, public payload: Error) {
    this.type = type;
    this.feature = feature;
  }
}
