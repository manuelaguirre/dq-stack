import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { DqTheme } from 'src/app/shared/models/dq-theme';
import { BackofficeService } from '../services/backoffice.service';

@Component({
  selector: 'dq-new-form',
  templateUrl: './new-form.component.html'
})

export class NewFormComponent {
  @Input() formGroup: FormGroup = null;

  themes$: Observable<DqTheme[]> = this.backOfficeService.getThemes();

  constructor(
    private backOfficeService: BackofficeService,
  ) {}
}