import { Component, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { DqPlayer } from '../../../../shared/models/dq-player';
import { PlayersService } from '../../shared/services/players.service';

@Component({
  selector: 'dq-players',
  templateUrl: 'dq-players.component.html',
})

export class DqPlayersComponent {
  players$: Observable<DqPlayer[]> = null;

  displayedColumns: string[] = ['name', 'lastName', 'mail', 'edit'];

  dataSource: MatTableDataSource<DqPlayer> = null;

  @ViewChild(MatSort) sort: MatSort;

  constructor(
    public router: Router,
    private playersService: PlayersService,
  ) { }

  ngOnInit(): void {
    this.players$ = this.playersService.getPlayers().pipe(
      tap((players) => {
        this.dataSource = new MatTableDataSource(players);
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

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  // deletePlayer(playerId: string, event: any): void {
  //   event.stopPropagation();
  //   this.subscriptions.push(
  //     this.snackbarService.showMessage('Are you sure to want to delete this player?', 'Yes').onAction()
  //       .pipe(
  //         switchMap(() => this.backOfficeService.deletePlayer(playerId)),
  //         tap(() => {
  //           this.snackbarService.showMessage('Player deleted successfully');
  //         }),
  //         catchError((e) => {
  //           this.snackbarService.showError(
  //             `Error: ${e && e.message ? e.message : 'unknown'}`,
  //           );
  //           return throwError(e);
  //         }),
  //       ).subscribe(),
  //   );
  // }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
