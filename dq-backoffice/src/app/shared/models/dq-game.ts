import { DqPlayer } from './dq-player';
import { DqTheme } from './dq-theme';

export interface DqGame {
  dateCreated: string;
  datePlayed: string;
  name: string;
  themes: DqTheme[];
  players: DqPlayer[];
  _id: string;
}
