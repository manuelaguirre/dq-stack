import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  catchError, filter, map, switchMap,
} from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';
import { of, Observable } from 'rxjs';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SnackBarService } from '../../../../../shared/services/snack-bar.service';
import { DqPlayer } from '../../../../../shared/models/dq-player';
import { PlayersService } from '../../../shared/services/players.service';
import { DqEntity } from '../../../../store/state';

@Component({
  selector: 'dq-player-detail',
  templateUrl: './dq-player-detail.component.html',
})

export class DqPlayerDetailComponent implements OnInit {
  playerDetailForm$: Observable<FormGroup> = null;

  detailForm: FormGroup = null;

  playerEntity$: Observable<DqEntity<DqPlayer>> = null;

  playerLoaded$: Observable<boolean> = null;

  loading = false;

  loadingNew = false;

  createNew = false;

  playerId = '';

  isPopup = false;

  constructor(
    private formBuilder: FormBuilder,
    private playersService: PlayersService,
    private snackBarService: SnackBarService,
    public router: Router,
    private route: ActivatedRoute,
    public dialogRef: MatDialogRef<DqPlayerDetailComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { isPopup: boolean; },
  ) { }

  ngOnInit(): void {
    this.loading = true;
    this.playerEntity$ = this.route.params.pipe(
      switchMap((params) => {
        if (params.id && params.id !== 'new') {
          this.playerId = params.id;
          return this.playersService.getPlayerEntityState(this.playerId);
        }
        this.createNew = true;
        return of(null);
      }),
    );
    this.playerLoaded$ = this.playerEntity$.pipe(
      map((playerState) => !playerState || !playerState.loading),
    );
    this.playerDetailForm$ = this.playerEntity$.pipe(
      filter((playerState) => !playerState || playerState.success),
      switchMap((playerState) => of(this.createForm(playerState ? playerState.value : null))),
    );
    if (this.data && this.data.isPopup) {
      this.isPopup = true;
    }
  }

  addNewPlayer(playerForm: FormGroup): void {
    this.loadingNew = true;
    this.playersService.createNewPlayer(this.getPlayer(playerForm))
      .pipe(
        filter((state) => !state.loading),
        map((state) => {
          if (state && !!state.error) {
            this.detailForm.markAsPristine();
            this.snackBarService.showMessage('Player created successfully');
            if (this.isPopup) {
              this.dialogRef.close(state.value);
            } else {
              this.router.navigate(['home/players']);
            }
          } else {
            this.snackBarService.showError('Error: Player not created');
          }
        }),
        catchError((e) => {
          this.snackBarService.showError('Error: Player not created');
          console.log(e);
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
    } else {
      this.createNew = false;
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
