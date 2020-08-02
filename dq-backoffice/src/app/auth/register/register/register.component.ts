import { Component, OnInit } from '@angular/core';
import {
  FormBuilder, FormGroup, Validators,
} from '@angular/forms';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;

  error: string;

  types: string[] = [];

  registerToContest = '';

  loading = false;

  constructor(
    private fb: FormBuilder,
    private titleService: Title,
  ) {}

  ngOnInit() {
    this.titleService.setTitle('Back office -');
    this.registerForm = this.fb.group({
      user: ['', Validators.required],
      pass: ['', Validators.required],
      passconf: ['', Validators.required],
      name: ['', Validators.required],
      lastName: ['', Validators.required],
    }, { validators: this.samePassword });
  }

  async register() {
    this.loading = true;
    try {
      // Register
    } catch (err) {
      console.log(err);
      this.error = err.message;
      this.loading = false;
    }
  }

  // eslint-disable-next-line class-methods-use-this
  samePassword(group: FormGroup) {
    const differentPassword = group.controls.pass.value !== group.controls.passconf.value;
    return differentPassword ? { differentPassword: true } : null;
  }

  get passwordInvalid() {
    const control = this.registerForm.get('pass');
    return control.hasError('required') && control.touched;
  }

  get emailFormat() {
    const control = this.registerForm.get('user');
    return control.touched && (control.hasError('required'));
  }

  get confirmPasswordInvalid() {
    const control = this.registerForm.get('passconf');
    return this.registerForm.hasError('differentPassword') && control.touched;
  }

  get nameInvalid() {
    const control = this.registerForm.get('name');
    const control2 = this.registerForm.get('lastName');
    return (control.hasError('required') && control.touched) || (control2.hasError('required') && control2.touched);
  }

  get disableButton() {
    return this.registerForm.invalid;
  }
}
