import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'dq-new-form',
  templateUrl: './new-form.component.html'
})

export class NewFormComponent {
  @Input() formGroup: FormGroup = null;
}