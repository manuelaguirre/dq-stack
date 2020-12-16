import { DqTheme } from './shared/models/dq-theme';
import { DqQuestion } from './shared/models/dq-questions';
import { DqPlayer } from './shared/models/dq-player';

export interface State {
  token: string;
  themes: DqTheme[];
  questions: {
    [themeId: string] : Partial<DqQuestion>[];
  };
  selectedTheme: string;
  players: DqPlayer[];
}
