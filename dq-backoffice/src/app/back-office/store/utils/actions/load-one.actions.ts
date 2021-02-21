/* eslint-disable max-classes-per-file */
import {
  DqLoaderAction,
  DqLoaderCreateMeta,
  DqLoaderEditMeta,
  DqLoaderOneMeta,
  DQ_CREATE_LOAD_ACTION,
  DQ_EDIT_LOAD_ACTION,
  DQ_ENTITY_FAIL_ACTION,
  DQ_ENTITY_LOAD_ACTION,
  DQ_ENTITY_SUCCESS_ACTION,
  DQ_EDIT_SUCCESS_ACTION,
  DQ_EDIT_FAIL_ACTION,
  DQ_CREATE_SUCCESS_ACTION,
  DQ_CREATE_FAIL_ACTION,
} from './dq-loader.actions';

export class DqLoadOneLoadAction implements DqLoaderAction {
  meta = DQ_ENTITY_LOAD_ACTION as DqLoaderOneMeta;

  type = '';

  feature = '';

  payload = null;

  constructor(type: string, feature: string, public id: string, payload = null) {
    this.type = type;
    this.feature = feature;
    this.payload = payload;
  }
}

export class DqLoadOneSuccessAction<T> implements DqLoaderAction {
  meta = DQ_ENTITY_SUCCESS_ACTION as DqLoaderOneMeta;

  type = '';

  feature = ''

  constructor(type: string, feature: string, public id: string, public payload: T) {
    this.type = type;
    this.feature = feature;
  }
}

export class DqLoadOneFailAction implements DqLoaderAction {
  meta = DQ_ENTITY_FAIL_ACTION as DqLoaderOneMeta;

  type = '';

  feature = ''

  constructor(type: string, feature: string, public id: string, public error: Error) {
    this.type = type;
    this.feature = feature;
  }
}

export class DqEditOneLoadAction implements DqLoaderAction {
  meta = DQ_EDIT_LOAD_ACTION as DqLoaderEditMeta;

  type = '';

  feature = '';

  payload = null;

  constructor(type: string, feature: string, public id: string, payload = null) {
    this.type = type;
    this.feature = feature;
    this.payload = payload;
  }
}

export class DqEditOneSuccessAction implements DqLoaderAction {
  meta = DQ_EDIT_SUCCESS_ACTION as DqLoaderEditMeta;

  type = '';

  feature = '';

  payload = null;

  constructor(type: string, feature: string, public id: string, payload = null) {
    this.type = type;
    this.feature = feature;
    this.payload = payload;
  }
}

export class DqEditOneFailAction implements DqLoaderAction {
  meta = DQ_EDIT_FAIL_ACTION as DqLoaderEditMeta;

  type = '';

  feature = ''

  constructor(type: string, feature: string, public id: string, public error: Error) {
    this.type = type;
    this.feature = feature;
  }
}

export class DqCreateOneLoadAction implements DqLoaderAction {
  meta = DQ_CREATE_LOAD_ACTION as DqLoaderCreateMeta;

  type = '';

  feature = '';

  payload = null;

  constructor(type: string, feature: string, public id: string, payload = null) {
    this.type = type;
    this.feature = feature;
    this.payload = payload;
  }
}

export class DqCreateOneSuccessAction implements DqLoaderAction {
  meta = DQ_CREATE_SUCCESS_ACTION as DqLoaderCreateMeta;

  type = '';

  feature = '';

  payload = null;

  constructor(type: string, feature: string, public id: string, payload = null) {
    this.type = type;
    this.feature = feature;
    this.payload = payload;
  }
}

export class DqCreateOneFailAction implements DqLoaderAction {
  meta = DQ_CREATE_FAIL_ACTION as DqLoaderCreateMeta;

  type = '';

  feature = ''

  constructor(type: string, feature: string, public id: string, public error: Error) {
    this.type = type;
    this.feature = feature;
  }
}
