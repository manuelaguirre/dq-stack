import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { catchError, map, switchMap } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';
import { of, Observable } from 'rxjs';
import { SnackBarService } from '../../../../../shared/services/snack-bar.service';
import { DqPlayer } from '../../../../../shared/models/dq-player';
import { PlayersService } from '../../../shared/services/players.service';

@Component({
  selector: 'dq-player-detail',
  templateUrl: './dq-player-detail.component.html',
})

export class DqPlayerDetailComponent implements OnInit {
  playerDetailForm$: Observable<FormGroup> = null;

  detailForm: FormGroup = null;

  player$: Observable<Partial<DqPlayer>> = null;

  loading = false;

  loadingNew = false;

  createNew = false;

  playerId = '';

  constructor(
    private formBuilder: FormBuilder,
    private playersService: PlayersService,
    private snackBarService: SnackBarService,
    public router: Router,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.loading = true;
    this.player$ = this.route.params.pipe(
      switchMap((params) => {
        if (params.id && params.id !== 'new') {
          this.playerId = params.id;
          return this.playersService.getPlayer(this.playerId);
        }
        this.createNew = true;
        return of({});
      }),
    );
    this.playerDetailForm$ = this.player$.pipe(
      switchMap((player: DqPlayer) => of(this.createForm(player))),
    );
  }

  addNewPlayer(playerForm: FormGroup): void {
    this.loadingNew = true;
    this.playersService.createNewPlayer(this.getPlayer(playerForm))
      .pipe(
        map((player) => {
          if (player) {
            this.detailForm.markAsPristine();
            this.snackBarService.showMessage('Player created successfully');
            this.router.navigate(['home/players']);
          } else {
            this.snackBarService.showError('Error: Player not created');
          }
        }),
        catchError(() => {
          this.snackBarService.showError('Error: Player not created');
          return of(null);
        }),
      )
      .subscribe(() => {
        this.loadingNew = false;
      });
  }

  editPlayer(newPlayerForm: FormGroup): void {
    this.loadingNew = true;
    this.playersService.editPlayer(this.playerId, {
      firstName: newPlayerForm.value.firstName,
      lastName: newPlayerForm.value.lastName,
      email: newPlayerForm.value.mail,
    }).pipe(
      map((player) => {
        if (player) {
          this.detailForm.markAsPristine();
          this.snackBarService.showMessage('Player edited successfully');
          this.router.navigate(['home/players']);
        } else {
          this.snackBarService.showError('Error: Player not edited');
        }
      }),
      catchError(() => {
        this.snackBarService.showError('Error: Player not edited');
        return of(null);
      }),
    )
      .subscribe(() => {
        this.loadingNew = false;
      });
  }

  getPlayer(newPlayerForm: FormGroup): Partial<DqPlayer> {
    return {
      firstName: newPlayerForm.value.firstName,
      lastName: newPlayerForm.value.lastName,
      email: newPlayerForm.value.mail,
    };
  }

  createForm(player?: DqPlayer): FormGroup {
    if (!player || !player._id) {
      this.createNew = true;
    }
    this.detailForm = this.formBuilder.group({
      firstName: [player ? player.firstName : '', Validators.required],
      lastName: [player ? player.lastName : '', Validators.required],
      mail: [player ? player.email : '', Validators.required],
    });
    this.loading = false;
    return this.detailForm;
  }
}
