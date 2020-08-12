import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BackofficeService } from '../../../shared/services/backoffice.service';
import { catchError, map } from 'rxjs/operators';
import { SnackBarService } from '../../../../../shared/services/snack-bar.service';
import { Router } from '@angular/router';
import { of } from 'rxjs';

@Component({
  selector: 'dq-new-theme',
  templateUrl: './dq-new-theme.component.html'
})

export class DqNewThemeComponent implements OnInit {
  newThemeForm: FormGroup = null;

  loadingNew = false;

  constructor(
    private formBuilder: FormBuilder,
    private backOfficeService: BackofficeService,
    private snackBarService: SnackBarService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.newThemeForm = this.formBuilder.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
    });
  }

  addNewTheme() {
    this.loadingNew = true;
    this.backOfficeService.createNewTheme(this.newThemeForm.value.name, this.newThemeForm.value.description)
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
}