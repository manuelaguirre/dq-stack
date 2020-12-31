import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { catchError, map, switchMap } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';
import { of, Observable } from 'rxjs';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { SnackBarService } from '../../../../../shared/services/snack-bar.service';
import { DqGame } from '../../../../../shared/models/dq-game';
import { GamesService } from '../../../shared/services/games.service';
import { DqPlayer } from '../../../../../shared/models/dq-player';
import { DqTheme } from '../../../../../shared/models/dq-theme';
import { PlayersService } from '../../../shared/services/players.service';
import { BackofficeService } from '../../../shared/services/backoffice.service';

@Component({
  selector: 'dq-game-detail',
  templateUrl: './dq-game-detail.component.html',
})
export class DqGameDetailComponent implements OnInit {
  gameDetailForm$: Observable<FormGroup> = null;

  detailForm: FormGroup = null;

  game$: Observable<Partial<DqGame>> = null;

  players$: Observable<DqPlayer[]> = null;

  selectedPlayers: DqPlayer[] = [];

  themes$: Observable<DqTheme[]> = null;

  selectedThemes: DqTheme[] = [];

  loading = false;

  loadingNew = false;

  createNew = false;

  gameId = '';

  constructor(
    private formBuilder: FormBuilder,
    private gamesService: GamesService,
    private playersService: PlayersService,
    private backOfficeService: BackofficeService,
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
    this.players$ = this.playersService.getPlayers();
    this.themes$ = this.backOfficeService.getThemes();
  }

  editGame(gameForm: FormGroup): void {
    // TODO: Edit game
    console.log(gameForm);
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
      players: this.createArrayForm(game.players),
      themes: this.createArrayForm(game.themes, 10),
    });
    this.loading = false;
    return this.detailForm;
  }

  // Minimum quantity of values to validate the form control
  minLengthArray(min: number): (c: AbstractControl) => {
    [key: string]: any;
  } {
    return (c: AbstractControl): {[key: string]: any;} => {
      if (c.value.length >= min) {
        return null;
      }
      return { MinLengthArray: true };
    };
  }

  createArrayForm(values?: DqPlayer[] | DqTheme[], minimum?: number): FormArray {
    const form = this.formBuilder.array([], Validators.required);
    console.log(values);
    if (values) {
      (values as any[]).map((value) => form.push(this.formBuilder.control(value)));
    }
    if (minimum) {
      form.setValidators([Validators.required, this.minLengthArray(minimum)]);
    }
    return form;
  }

  drop(event: CdkDragDrop<string[]>, gameDetailForm: FormGroup, groupName: string): void {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
      const form: FormArray = gameDetailForm.get(groupName) as FormArray;
      if (event.container.id === 'cdk-drop-list-1'
      || event.container.id === 'cdk-drop-list-3') {
        form.push(
          this.formBuilder.control(event.container.data[event.currentIndex]),
        );
      } else {
        form.removeAt(event.previousIndex);
      }
    }
  }
}