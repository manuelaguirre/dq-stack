import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot,
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { GamesService } from '../../shared/services/games.service';

@Injectable({ providedIn: 'root' })
export class DqPlayedGameGuard implements CanActivate {
  constructor(
    private gamesService: GamesService,
    private router: Router,
  ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    const gameId: string = route.params.id;
    if (!state.url.includes('results')) {
      // Edit not played game
      if (gameId === 'new') {
        // New game can go
        return of(true);
      }
      return this.gamesService.getFullGame(gameId).pipe(
        map((game) => {
          // If the game does not exist, return to the main page
          if (!game) {
            this.router.navigate(['home/games']);
            return false;
          } if (game.datePlayed !== null && game.datePlayed !== undefined) {
            // Game already played. Redirect to results page
            this.router.navigate([`home/games/${gameId}/results`]);
            return false;
          }
          return true;
        }),
        catchError(() => this.router.navigate(['home/games'])),
      );
    }
    return this.gamesService.getFullGame(gameId).pipe(
      map((game) => {
        // If the game does not exist, return to the main page
        if (!game) {
          this.router.navigate(['home/games']);
          return false;
        } if (game.datePlayed === null || game.datePlayed === undefined) {
          // Game not played. Redirect to edit game page
          this.router.navigate([`home/games/${gameId}`]);
          return false;
        }
        return true;
      }),
      catchError(() => this.router.navigate(['home/games'])),
    );
  }
}
