import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BackofficeService } from '../../../shared/services/backoffice.service';
import { catchError, map, switchMap } from 'rxjs/operators';
import { SnackBarService } from '../../../../../shared/services/snack-bar.service';
import { Router, ActivatedRoute } from '@angular/router';
import { of, Observable } from 'rxjs';
import { DqTheme } from 'src/app/shared/models/dq-theme';

@Component({
  selector: 'dq-theme-detail',
  templateUrl: './dq-theme-detail.component.html'
})

export class DqThemeDetailComponent implements OnInit {
  newThemeForm$: Observable<FormGroup> = null;

  loadingNew = false;

  createNew = false;

  themeId = '';

  constructor(
    private formBuilder: FormBuilder,
    private backOfficeService: BackofficeService,
    private snackBarService: SnackBarService,
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.newThemeForm$ = this.route.params.pipe(
      switchMap((params) => {
        if (params.id && params.id !== 'new') {
          this.themeId = params.id;
          return this.backOfficeService.getTheme(this.themeId);
        }
        this.createNew = true;
        return of(null);
      }),
      switchMap((theme) => of(this.createForm(theme))),
    );
  }

  addNewTheme(themeForm: FormGroup): void {
    this.loadingNew = true;
    this.backOfficeService.createNewTheme(themeForm.value.name, themeForm.value.description)
      .pipe(
        map((theme) => {
          if (theme) {
            this.snackBarService.showMessage('Theme created successfully');
            this.router.navigate(['home/themes']);
          } else {
            this.snackBarService.showError('Error: Theme not created');
          }
        }),
        catchError((error) => {
          this.snackBarService.showError('Error: Theme not created');
          return of(null);
        })
      )
      .subscribe(() => this.loadingNew = false);
  }

  editTheme(themeForm: FormGroup): void {
    this.loadingNew = true;
    this.backOfficeService.editTheme(this.themeId, {
      name: themeForm.value.name,
      description: themeForm.value.description,
    }).pipe(
      map((theme) => {
        if (theme) {
          this.snackBarService.showMessage('Theme edited successfully');
          this.router.navigate(['home/themes']);
        } else {
          this.snackBarService.showError('Error: Theme not edited');
        }
      }),
      catchError((error) => {
        this.snackBarService.showError('Error: Theme not edited');
        return of(null);
      })
    )
    .subscribe(() => this.loadingNew = false);
  }

  createForm(theme?: DqTheme): FormGroup {
    if (!theme) {
      this.createNew = true;
    }
    return this.formBuilder.group({
      name: [theme ? theme.name : '', Validators.required],
      description: [theme ? theme.description :'', Validators.required],
    });
  }
}