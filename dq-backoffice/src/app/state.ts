import { DqTheme } from './shared/models/dq-theme';
import { DqQuestion } from './shared/models/dq-questions';
import { DqGame, DqGameLight } from './shared/models/dq-game';

export interface State {
  token: string;
  themes: DqTheme[];
  questions: {
    [themeId: string] : Partial<DqQuestion>[];
  };
  selectedTheme: string;
  games: DqGameLight[];
  fullGames: DqGame[];
}
