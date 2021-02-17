import {
  Component, ElementRef, OnInit, QueryList, ViewChildren,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import {
  map, switchMap, take,
} from 'rxjs/operators';
import {
  DqGame, DqGameFinalResults, DqGameResults, DqQuestionResult,
} from '../../../../../shared/models/dq-game';
import { DqPlayer } from '../../../../../shared/models/dq-player';
import { GamesService } from '../../../shared/services/games.service';
import { PlayersService } from '../../../shared/services/players.service';
import { DqResultCorrect, DqVictimResult, DqStolenPoints } from './dq-game-results.model';

@Component({
  selector: 'dq-game-results',
  templateUrl: 'dq-game-results.component.html',
})

export class DqGameResultsComponent implements OnInit {
  @ViewChildren('dqtablecontainer') tableContainers: QueryList<ElementRef<HTMLElement>>;

  game$: Observable<Partial<DqGame>> = null;

  // Player information
  playerDetailById: Map<string, Observable<DqPlayer>> = new Map<string, Observable<DqPlayer>>();

  // Final Results
  finalResults$: Observable<DqGameFinalResults[]> = null;

  finalResultsColumns: string[] = ['playerName', 'points'];

  // Most correct answers
  correctAnswers$: Observable<DqResultCorrect[]> = null;

  finalResultCorrectColumns: string[] = ['playerName', 'correct'];

  // Most stolen points
  stolenPoints$: Observable<DqStolenPoints[]> = null;

  stolenPointsColumns: string[] = ['playerName', 'stolenPoints', 'number'];

  // Most stolen points (Use correct interface)
  blockNumber$: Observable<DqResultCorrect[]> = null;

  blockNumberColumns: string[] = ['playerName', 'blockNum'];

  // Victim
  victimResults$: Observable<DqVictimResult[]> = null;

  victimResultsColumns: string[] = ['playerName', 'stolenPoints', 'blockNumber'];

  isFullScreen = false;

  interval = null;

  constructor(
    private gamesService: GamesService,
    public router: Router,
    private route: ActivatedRoute,
    private playersService: PlayersService,
  ) { }

  ngOnInit(): void {
    this.game$ = this.route.params.pipe(
      switchMap((params) => this.gamesService.getFullGame(params.id)),
      take(1),
    );
    this.finalResults$ = this.game$.pipe(
      map((game) => game.results.finalResults.sort((a, b) => b.points - a.points)),
    );
    this.correctAnswers$ = this.game$.pipe(
      map((game) => this.getCorrectAnswersMap(game.results)),
    );
    this.stolenPoints$ = this.game$.pipe(
      map((game) => this.getStolenPointsData(game.results)),
    );
    this.blockNumber$ = this.game$.pipe(
      map((game) => this.getStolenPointsData(game.results)),
    );
    this.victimResults$ = this.game$.pipe(
      map((game) => this.getVictimResultsData(game.results)),
    );
    document.documentElement.onfullscreenchange = () => this.fullScreenChange();
  }

  fullScreenChange(): void {
    this.isFullScreen = !this.isFullScreen;
    if (this.fullScreen) {
      const tables = this.tableContainers.toArray();
      if (tables) {
        const total = tables.length;
        clearInterval(this.interval);
        tables.forEach((table) => table.nativeElement.classList.remove('active'));
        tables[0].nativeElement.classList.add('active');
        let i = 1;
        this.interval = setInterval(() => {
          // method to be executed;
          tables[(i - 1) % total].nativeElement.classList.remove('active');
          tables[(i) % total].nativeElement.classList.add('active');
          i++;
        }, 5000);
      }
    }
  }

  fullScreen(): void {
    const elem = document.documentElement as any;
    const methodToBeInvoked = elem.requestFullscreen || elem.webkitRequestFullScreen
      || elem.mozRequestFullscreen || elem.msRequestFullscreen;
    if (methodToBeInvoked) {
      methodToBeInvoked.call(elem);
    }
  }

  getPlayerDetail(playerId: string): Observable<DqPlayer> {
    if (!this.playerDetailById.has(playerId)) {
      this.playerDetailById.set(playerId, this.playersService.getPlayer(playerId));
    }
    return this.playerDetailById.get(playerId);
  }

  getCorrectAnswersMap(result: DqGameResults): DqResultCorrect[] {
    const correctByPlayer: Map<string, number> = new Map();
    const rounds = ['firstRound', 'secondRound', 'thirdRound'];
    for (let i = 0; i < rounds.length; i++) {
      result[rounds[i]].forEach((question) => question.answers.forEach(
        (answer) => {
          if (answer.correct) {
            if (!correctByPlayer.has(answer.player)) {
              correctByPlayer.set(answer.player, 0);
            }
            correctByPlayer.set(answer.player, correctByPlayer.get(answer.player) + 1);
          }
        },
      ));
    }
    const resultCorrect: DqResultCorrect[] = [];
    correctByPlayer.forEach((value, key) => resultCorrect.push({ playerId: key, number: value }));
    return resultCorrect.sort((a, b) => b.number - a.number);
  }

  getStolenPointsData(result: DqGameResults): DqStolenPoints[] {
    const stolenByPlayer: Map<string, number[]> = new Map();
    const rounds = ['firstRound', 'secondRound', 'thirdRound'];
    for (let i = 0; i < rounds.length; i++) {
      result[rounds[i]].forEach((question: DqQuestionResult) => question.answers.forEach(
        (answer) => {
          if (answer.stolenPoints) {
            if (!stolenByPlayer.has(answer.player)) {
              // Store [stolentPoints, stolenNum] by player
              stolenByPlayer.set(answer.player, [0, 0]);
            }
            const data = stolenByPlayer.get(answer.player);
            data[0] += answer.stolenPoints;
            data[1] += 1;
          }
        },
      ));
    }
    const stolenPoints: DqStolenPoints[] = [];
    stolenByPlayer.forEach((value, key) => stolenPoints.push({
      playerId: key, points: value[0], number: value[1],
    }));
    return stolenPoints.sort((a, b) => b.points - a.points);
  }

  getBlockData(result: DqGameResults): DqResultCorrect[] {
    const blockByPlayer: Map<string, number> = new Map();
    const rounds = ['firstRound', 'secondRound', 'thirdRound'];
    for (let i = 0; i < rounds.length; i++) {
      result[rounds[i]].forEach(
        (question: DqQuestionResult) => question.jokers.forEach(
          (joker) => {
            if (joker.value === 'BLOCK') {
              if (!blockByPlayer.has(joker.player)) {
                // Store [stolenPoints, blockedNum] by player
                blockByPlayer.set(joker.player, 0);
              }
              blockByPlayer.set(joker.player, blockByPlayer.get(joker.player) + 1);
            }
          },
        ),
      );
    }
    const blockNumber: DqResultCorrect[] = [];
    blockByPlayer.forEach((value, key) => blockNumber.push({
      playerId: key, number: value,
    }));
    return blockNumber.sort((a, b) => b.number - a.number);
  }

  getVictimResultsData(result: DqGameResults): DqVictimResult[] {
    const dataByPlayer: Map<string, number[]> = new Map();
    const rounds = ['firstRound', 'secondRound', 'thirdRound'];
    for (let i = 0; i < rounds.length; i++) {
      result[rounds[i]].forEach((question: DqQuestionResult) => question.jokers.forEach(
        (joker) => {
          if (joker.value === 'STEAL') {
            const answer = question.answers.find((a) => a.player === joker.player);
            const { target } = joker;
            if (target && answer) {
              if (!dataByPlayer.has(target)) {
                // Store [stolenPoints, blockedNum] by player
                dataByPlayer.set(target, [0, 0]);
              }
              const data = dataByPlayer.get(target);
              data[0] += answer.stolenPoints;
            }
          }
          if (joker.value === 'BLOCK') {
            const { target } = joker;
            if (target) {
              if (!dataByPlayer.has(target)) {
                // Store [stolenPoints, blockedNum] by player
                dataByPlayer.set(target, [0, 0]);
              }
              const data = dataByPlayer.get(target);
              data[1] += 1;
            }
          }
        },
      ));
    }
    const dataPlayer: DqVictimResult[] = [];
    dataByPlayer.forEach((value, key) => dataPlayer.push({
      playerId: key, stolenPoints: value[0], blockNumber: value[1],
    }));
    return dataPlayer.sort((a, b) => b.stolenPoints - a.stolenPoints);
  }
}
