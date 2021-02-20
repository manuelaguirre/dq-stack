import { DqEntity, DqEntityMap } from '../../state';

export function dqEntityLoaderSelector<T>(state: DqEntityMap<T>, id: string): DqEntity<T> {
  return state.entities[id] || undefined;
}
