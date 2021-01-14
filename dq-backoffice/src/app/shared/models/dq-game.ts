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

export interface DqGameLight {
  dateCreated: string;
  datePlayed: string;
  name: string;
  themes: string[];
  players: string[];
  _id: string;
}
