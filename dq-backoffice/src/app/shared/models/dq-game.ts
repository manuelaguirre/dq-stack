import { DqPlayer } from './dq-player';
import { DqTheme } from './dq-theme';

export interface DqQuestionResult {
  question: string;
  answers: [{
    player: string;
    hadAnswered: boolean;
    correct: boolean;
    points: number;
    stolenPoints: number;
  }];
  jokers: [{
    player: string;
    value: 'DOUBLE' | 'FIFTYFIFTY' | 'BLOCK' | 'STEAL';
    target: string;
  }];
}

export interface DqGameFinalResults {
  player: string;
  points: number;
}

export interface DqGameResults {
  firstRound: DqQuestionResult[];
  secondRound: DqQuestionResult[];
  thirdRound: DqQuestionResult[];
  finalResults: DqGameFinalResults[];
}

export interface DqGame {
  dateCreated: string;
  datePlayed: string;
  name: string;
  themes: DqTheme[];
  players: DqPlayer[];
  results: DqGameResults;
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
