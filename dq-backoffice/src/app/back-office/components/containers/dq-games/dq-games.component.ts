import { Component, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { DqGame } from '../../../../shared/models/dq-game';
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
})
export class DqGamesComponent {
  games$: Observable<DqGame[]> = null;

  displayedColumns: string[] = ['name', 'dateCreated', 'datePlayed', 'numberPlayers'];

  dataSource: MatTableDataSource<DqGameTable> = null;

  @ViewChild(MatSort) sort: MatSort;

  constructor(
    public router: Router,
    private gamesService: GamesService,
  ) { }

  ngOnInit(): void {
    this.games$ = this.gamesService.getGames().pipe(
      tap((games) => {
        if (games) {
          this.dataSource = new MatTableDataSource(games.map(
            (game) => ({
              name: game.name,
              dateCreated: game.dateCreated,
              datePlayed: game.datePlayed,
              numberPlayers: game.players.length,
              _id: game._id,
            }),
          ));
          setTimeout(() => {
            this.listenSort();
          }, 1000);
        }
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
}
