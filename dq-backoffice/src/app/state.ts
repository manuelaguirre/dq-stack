import { DqTheme } from './shared/models/dq-theme';
import { DqQuestion } from './shared/models/dq-questions';

export interface State {
  token: string;
  themes: DqTheme[];
  questions: {
    [themeId: string] : Partial<DqQuestion>[];
  };
  selectedTheme: string;
}
