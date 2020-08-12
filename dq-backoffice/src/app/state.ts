import { DqTheme } from './shared/models/dq-theme';
import { DQQuestion } from './shared/models/dq-questions';

export interface State {
  token: string;
  themes: DqTheme[];
  questions: DQQuestion[];
}
