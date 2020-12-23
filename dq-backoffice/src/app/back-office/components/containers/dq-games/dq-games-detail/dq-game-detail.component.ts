import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { catchError, map, switchMap } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';
import { of, Observable } from 'rxjs';
import { SnackBarService } from '../../../../../shared/services/snack-bar.service';
import { DqGame } from '../../../../../shared/models/dq-game';
import { GamesService } from '../../../shared/services/games.service';

@Component({
  selector: 'dq-game-detail',
  templateUrl: './dq-game-detail.component.html',
})
export class DqGameDetailComponent implements OnInit {
  gameDetailForm$: Observable<FormGroup> = null;

  detailForm: FormGroup = null;

  game$: Observable<Partial<DqGame>> = null;

  loading = false;

  loadingNew = false;

  createNew = false;

  gameId = '';

  constructor(
    private formBuilder: FormBuilder,
    private gamesService: GamesService,
    private snackBarService: SnackBarService,
    public router: Router,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.loading = true;
    this.game$ = this.route.params.pipe(
      switchMap((params) => {
        if (params.id && params.id !== 'new') {
          this.gameId = params.id;
          return this.gamesService.getGame(this.gameId);
        }
        this.createNew = true;
        return of({});
      }),
    );
    this.gameDetailForm$ = this.game$.pipe(
      switchMap((game: DqGame) => of(this.createForm(game))),
    );
  }

  addNewGame(gameForm: FormGroup): void {
    this.loadingNew = true;
    this.gamesService.createNewGame(this.getGame(gameForm))
      .pipe(
        map((game) => {
          if (game) {
            this.detailForm.markAsPristine();
            this.snackBarService.showMessage('Game created successfully');
            this.router.navigate(['home/games']);
          } else {
            this.snackBarService.showError('Error: Game not created');
          }
        }),
        catchError(() => {
          this.snackBarService.showError('Error: Game not created');
          return of(null);
        }),
      )
      .subscribe(() => {
        this.loadingNew = false;
      });
  }

  getGame(newGameForm: FormGroup): Partial<DqGame> {
    return {
      name: newGameForm.value.name,
      players: newGameForm.value.players,
      themes: newGameForm.value.themes,
    };
  }

  createForm(game?: DqGame): FormGroup {
    if (!game || !game._id) {
      this.createNew = true;
    }
    this.detailForm = this.formBuilder.group({
      name: [game ? game.name : '', Validators.required],
      players: [game ? game.players : '', Validators.required],
      themes: [game ? game.themes : '', Validators.required],
    });
    this.loading = false;
    return this.detailForm;
  }
}
