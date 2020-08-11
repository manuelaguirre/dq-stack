import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BackofficeService } from '../../../shared/services/backoffice.service';
import { catchError, map } from 'rxjs/operators';
import { SnackBarService } from '../../../../../shared/services/snack-bar.service';
import { Router } from '@angular/router';

@Component({
  selector: 'dq-new-theme',
  templateUrl: './dq-new-theme.component.html'
})

export class DqNewThemeComponent implements OnInit {
  newThemeForm: FormGroup = null;

  constructor(
    private formBuilder: FormBuilder,
    private backOfficeService: BackofficeService,
    private snackBarService: SnackBarService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.newThemeForm = this.formBuilder.group({
      name: '',
      description: '',
    });
  }

  addNewTheme() {
    this.backOfficeService.createNewTheme(this.newThemeForm.value.name, this.newThemeForm.value.description)
      .pipe(
        map((theme) => {
          if (theme) {
            this.snackBarService.showMessage('Theme created successfully');
            this.router.navigate(['themes']);
          } else {
            this.snackBarService.showError('Error: Theme not created');
          }
        }),
        catchError((error) => {
          this.snackBarService.showError('Error: Theme not created');
          return null;
        })
      )
      .subscribe();
  }
}