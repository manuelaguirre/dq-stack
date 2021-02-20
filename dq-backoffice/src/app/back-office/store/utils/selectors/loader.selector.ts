import { DqEntity } from '../../state';

export function dqLoaderValueSelector<T>(state: DqEntity<T>): T {
  return state.value;
}

export function dqLoaderLoadingSelector<T>(state: DqEntity<T>): boolean {
  return state.loading;
}

export function dqLoaderSuccessSelector<T>(state: DqEntity<T>): boolean {
  return state.success;
}

export function dqLoaderErrorSelector<T>(state: DqEntity<T>): Error {
  return state.error;
}
