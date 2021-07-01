import {
  ChangeDetectionStrategy,
  ChangeDetectorRef, Component, OnDestroy, ViewChild,
} from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Observable, Subscription, throwError } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { DqGame } from '../../../../shared/models/dq-game';
import { SnackBarService } from '../../../../shared/services/snack-bar.service';
import { GamesService } from '../../shared/services/games.service';

export interface DqGameTable {
  name: string;
  dateCreated: string;
  datePlayed: string;
  numberPlayers: number;
}

@Component({
  selector: 'dq-games',
  templateUrl: 'dq-games.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DqGamesComponent implements OnDestroy {
  games$: Observable<DqGame[]> = null;

  displayedColumns: string[] = ['name', 'dateCreated', 'datePlayed', 'numberPlayers', 'edit', 'delete'];

  dataSource: MatTableDataSource<DqGameTable> = null;

  subscriptions: Subscription[] = [];

  @ViewChild(MatSort) sort: MatSort;

  constructor(
    public router: Router,
    private gamesService: GamesService,
    private snackbarService: SnackBarService,
    private cdr: ChangeDetectorRef,
  ) { }

  ngOnInit(): void {
    this.games$ = this.gamesService.getGames().pipe(
      tap((games) => {
        if (!games) {
          return;
        }
        this.dataSource = null;
        this.dataSource = new MatTableDataSource(games.map(
          (game) => ({
            name: game.name,
            dateCreated: game.dateCreated,
            datePlayed: game.datePlayed,
            numberPlayers: game.players.length,
            _id: game._id,
          }),
        ));
        this.cdr.detectChanges();
        setTimeout(() => {
          this.listenSort();
        }, 1000);
      }),
    );
  }

  listenSort(): void {
    this.sort.disableClear = true;
    this.dataSource.sort = this.sort;
    this.dataSource.sortingDataAccessor = (data: any, sortHeaderId: string): string => {
      if (typeof data[sortHeaderId] === 'string') {
        return data[sortHeaderId].toLocaleLowerCase();
      }
      return data[sortHeaderId];
    };
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  deleteGames(gameId: string, event: any): void {
    event.stopPropagation();
    this.subscriptions.push(
      this.snackbarService.showMessage('Are you sure to want to delete this game?', 'Yes').onAction()
        .pipe(
          switchMap(() => this.gamesService.deleteGame(gameId)),
          tap(() => {
            this.snackbarService.showMessage('Game deleted successfully');
          }),
          catchError((e) => {
            this.snackbarService.showError(
              `Error: ${e && e.message ? e.message : 'unknown'}`,
            );
            return throwError(e);
          }),
        ).subscribe(),
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }
}
