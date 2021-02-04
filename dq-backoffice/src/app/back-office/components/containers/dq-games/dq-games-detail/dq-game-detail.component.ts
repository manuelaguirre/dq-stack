import {
  Component, OnInit, QueryList, ViewChildren,
} from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import {
  catchError, map, switchMap,
} from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';
import { of, Observable } from 'rxjs';
import {
  CdkDrag,
  CdkDragDrop, CdkDropList, moveItemInArray, transferArrayItem,
} from '@angular/cdk/drag-drop';
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

  themes$: Observable<DqTheme[]> = null;

  availableThemesPublic: DqTheme[] = null;

  availableThemesPrivate: DqTheme[] = null;

  availablePlayers: DqPlayer[] = null;

  loading = false;

  loadingNew = false;

  createNew = false;

  gameId = '';

  @ViewChildren(CdkDropList) containers_: QueryList<CdkDropList>;

  dropContainers: CdkDropList[] = [];

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
          return this.gamesService.getFullGame(this.gameId);
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
    setTimeout(() => {
      this.dropContainers = this.containers_.toArray();
    }, 1000);
  }

  editGame(gameForm: FormGroup): void {
    this.loadingNew = true;
    this.gamesService.editGame(this.gameId, this.getGame(gameForm))
      .pipe(
        map((game) => {
          if (game) {
            this.detailForm.markAsPristine();
            this.snackBarService.showMessage('Game edited successfully');
            this.router.navigate(['home/games']);
          } else {
            this.snackBarService.showError('Error: Game not edited');
          }
        }),
        catchError(() => {
          this.snackBarService.showError('Error: Game not edited');
          return of(null);
        }),
      )
      .subscribe(() => {
        this.loadingNew = false;
      });
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
      name: [game ? game.name : '', [Validators.required, Validators.min(5)]],
      players: this.createArrayForm(game.players),
      themes: this.createArrayForm(game.themes, 10),
      showPublic: this.formBuilder.control(true, []),
    });
    this.loading = false;
    return this.detailForm;
  }

  filterSelectedThemes(themes: DqTheme[], selected: DqTheme[], isPublic: boolean): DqTheme[] {
    if (isPublic) {
      if (!this.availableThemesPublic) {
        if (this.createNew) {
          const defaultThemes = themes.filter((theme) => theme.isDefault);
          const selectedIds = defaultThemes.map((theme) => theme._id);
          defaultThemes.forEach((t) => (this.detailForm.get('themes') as FormArray).push(this.formBuilder.control(t)));
          this.availableThemesPublic = themes.filter((t) => !selectedIds.includes(t._id) && t.isPublic);
        } else {
          const selectedIds = selected.map((theme) => theme._id);
          this.availableThemesPublic = themes.filter((t) => !selectedIds.includes(t._id) && t.isPublic);
        }
      }
      return this.availableThemesPublic;
    }
    if (!this.availableThemesPrivate) {
      const selectedIds = selected.map((theme) => theme._id);
      this.availableThemesPrivate = themes.filter((t) => !selectedIds.includes(t._id) && !t.isPublic);
    }
    return this.availableThemesPrivate;
  }

  filterSelectedPlayers(players: DqPlayer[], selected: DqPlayer[]): DqPlayer[] {
    if (!this.availablePlayers) {
      const selectedIds = selected.map((player) => player._id);
      this.availablePlayers = players.filter((t) => !selectedIds.includes(t._id));
    }
    return this.availablePlayers;
  }

  // Minimum quantity of values to validate the form control
  minLengthArray(min: number): (c: AbstractControl) => {
    [key: string]: any;
  } {
    return (c: AbstractControl): {[key: string]: any;} => {
      if (c.value.length === min) {
        return null;
      }
      return { MinLengthArray: true };
    };
  }

  createArrayForm(values?: DqPlayer[] | DqTheme[], minimum?: number): FormArray {
    const form = this.formBuilder.array([], Validators.required);
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
      this.transferItem(
        gameDetailForm,
        groupName,
        event.previousContainer,
        event.container,
        event.previousIndex,
        event.currentIndex,
      );
    }
  }

  transferItem(
    gameDetailForm: FormGroup,
    groupName: string,
    previousContainer: CdkDropList<string[]>,
    container: CdkDropList<string[]>,
    previousIndex: number,
    currentIndex: number,
  ): void {
    transferArrayItem(
      previousContainer.data,
      container.data,
      previousIndex,
      currentIndex,
    );
    const form: FormArray = gameDetailForm.get(groupName) as FormArray;
    const containerIDLast = parseInt(container.id[container.id.length - 1], 10);
    if (containerIDLast % 5 === 2 || containerIDLast % 5 === 4) {
      form.push(
        this.formBuilder.control(container.data[currentIndex]),
      );
    } else {
      form.removeAt(previousIndex);
    }
  }

  customDrop(
    index: number, container: number, container2: number, gameDetailForm: FormGroup, groupName: string,
  ): void {
    this.transferItem(
      gameDetailForm,
      groupName,
      this.dropContainers[container],
      this.dropContainers[container2],
      index,
      this.dropContainers[container2].data.length,
    );
  }

  privatePredicate(item: CdkDrag<DqTheme>): boolean {
    return !item.data.isPublic;
  }

  publicPredicate(item: CdkDrag<DqTheme>): boolean {
    return item.data.isPublic;
  }

  selectRandom(): void {
    let remaining = 10 - this.detailForm.get('themes').value.length;
    let available = this.availableThemesPublic.length;
    let i = 0;
    while (remaining && available) {
      // Add themes until haveing 10
      setTimeout(() => {
        const theme: DqTheme = this.availableThemesPublic.splice(
          Math.floor(Math.random() * this.availableThemesPublic.length), 1,
        )[0];
        (this.detailForm.get('themes') as FormArray).insert(
          0, this.formBuilder.control(theme),
        );
      }, i * 100);
      remaining--;
      available--;
      i++;
    }
  }
}
