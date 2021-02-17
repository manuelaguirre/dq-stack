export interface DqResultCorrect {
  playerId: string;
  number: number;
}

export interface DqVictimResult {
  playerId: string;
  stolenPoints: number;
  blockNumber: number;
}

export interface DqStolenPoints {
  playerId: string;
  points: number;
  number: number;
}
