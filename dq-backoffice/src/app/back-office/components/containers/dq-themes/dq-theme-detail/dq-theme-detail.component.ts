import { Component, OnInit } from '@angular/core';
import {
  FormBuilder, FormGroup, Validators, ValidatorFn, ValidationErrors,
} from '@angular/forms';
import { catchError, map, switchMap } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';
import { of, Observable } from 'rxjs';
import { SnackBarService } from '../../../../../shared/services/snack-bar.service';
import { BackofficeService } from '../../../shared/services/backoffice.service';
import { DqTheme } from '../../../../../shared/models/dq-theme';

@Component({
  selector: 'dq-theme-detail',
  templateUrl: './dq-theme-detail.component.html',
})

export class DqThemeDetailComponent implements OnInit {
  newThemeForm$: Observable<FormGroup> = null;

  detailForm: FormGroup = null;

  loadingNew = false;

  createNew = false;

  themeId = '';

  constructor(
    private formBuilder: FormBuilder,
    private backOfficeService: BackofficeService,
    private snackBarService: SnackBarService,
    public router: Router,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
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
    this.backOfficeService.createNewTheme(
      themeForm.value.name, themeForm.value.description, themeForm.value.isPublic,
    )
      .pipe(
        map((theme) => {
          if (theme) {
            this.detailForm.markAsPristine();
            this.snackBarService.showMessage('Theme created successfully');
            this.router.navigate(['home/themes']);
          } else {
            this.snackBarService.showError('Error: Theme not created');
          }
        }),
        catchError(() => {
          this.snackBarService.showError('Error: Theme not created');
          return of(null);
        }),
      )
      .subscribe(() => {
        this.loadingNew = false;
      });
  }

  editTheme(themeForm: FormGroup): void {
    this.loadingNew = true;
    const theme: Partial<DqTheme> = {
      name: themeForm.value.name,
      description: themeForm.value.description,
      isPublic: themeForm.value.isPublic,
    };
    if (!themeForm.value.isPublic) {
      theme.company = {
        name: themeForm.value.companyName,
        subname: themeForm.value.companySubName,
      };
    }
    this.backOfficeService.editTheme(this.themeId, theme).pipe(
      map((theme_) => {
        if (theme_) {
          this.snackBarService.showMessage('Theme edited successfully');
          this.router.navigate(['home/themes']);
        } else {
          this.snackBarService.showError('Error: Theme not edited');
        }
      }),
      catchError(() => {
        this.snackBarService.showError('Error: Theme not edited');
        return of(null);
      }),
    ).subscribe(() => {
      this.loadingNew = false;
    });
  }

  createForm(theme?: DqTheme): FormGroup {
    if (!theme) {
      this.createNew = true;
    }
    this.detailForm = this.formBuilder.group({
      name: [theme ? theme.name : '', Validators.required],
      isPublic: [theme ? theme.isPublic : true, Validators.required],
      description: [theme ? theme.description : '', Validators.required],
      companyName: [theme && theme.company ? theme.company.name : ''],
      companySubName: [theme && theme.company ? theme.company.subname : ''],
    }, { validators: this.validPrivateTheme });
    return this.detailForm;
  }

  validPrivateTheme: ValidatorFn = (control: FormGroup): ValidationErrors | null => {
    const isPublic = control.get('isPublic');
    if (isPublic.value) {
      return null;
    }
    const companyName = control.get('companyName');
    const companySubName = control.get('companySubName');

    return companyName.value === '' || companySubName.value === '' ? { invalidPrivate: true } : null;
  };
}
