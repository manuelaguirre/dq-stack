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

export const DQ_EDIT_LOAD_ACTION = '[DQEDIT] LOAD';
export const DQ_EDIT_FAIL_ACTION = '[DQEDIT] LOAD FAIL';
export const DQ_EDIT_SUCCESS_ACTION = '[DQEDIT] LOAD SUCCESS';

export type DqLoaderEditMeta = typeof DQ_EDIT_LOAD_ACTION | typeof DQ_EDIT_FAIL_ACTION | typeof DQ_EDIT_SUCCESS_ACTION;

export const DQ_CREATE_LOAD_ACTION = '[DQCREATE] LOAD';
export const DQ_CREATE_FAIL_ACTION = '[DQCREATE] LOAD FAIL';
export const DQ_CREATE_SUCCESS_ACTION = '[DQCREATE] LOAD SUCCESS';

export type DqLoaderCreateMeta = typeof DQ_CREATE_LOAD_ACTION
| typeof DQ_CREATE_FAIL_ACTION | typeof DQ_CREATE_SUCCESS_ACTION;

export type DqLoaderMeta = DqLoaderAllMeta | DqLoaderOneMeta | DqLoaderEditMeta | DqLoaderCreateMeta;

/**
 * @property payload: Optional data
 * @property meta: All/entity & Load/success/fail
 * @property type: Id of the action
 */
export interface DqLoaderAction extends Action {
  readonly payload?: any;
  readonly meta?: DqLoaderMeta;
  readonly feature: string;
  type: string;
}
