import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  FormGroup, FormBuilder, Validators,
} from '@angular/forms';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { Title } from '@angular/platform-browser';
import { AuthService } from '../../auth-form/services/auth.service';
import { SnackBarService } from 'src/app/shared/services/snack-bar.service';
import { Store } from 'src/app/store';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;

  error: string;

  logging = false;

  constructor(
    private router: Router,
    private authService: AuthService,
    private fb: FormBuilder,
    private titleService: Title,
    private snackBarService: SnackBarService,
    private store: Store,
  ) {}

  ngOnInit() {
    this.titleService.setTitle('DefiQuiz back office - Login');
    this.loginForm = this.fb.group({
      user: ['', Validators.required],
      pass: ['', Validators.required],
    });
  }

  async login() {
    this.logging = true;
    if (this.loginForm.valid) {
      try {
        this.authService.signIn(this.loginForm.value.user, this.loginForm.value.pass).pipe(
          catchError((error) => {
            console.log(error);
            if (error.code && error.code === 'auth/wrong-password') {
              this.snackBarService.showError('User/Pass incorrect');
            } else {
              this.snackBarService.showError('Conexion error');
            }
            this.logging = false;
            return of(null);
          }),
        ).subscribe((succes: { token: string }) => {
          if (succes) {
            if (succes.token) {
              localStorage.setItem('token', succes.token);
              this.store.set('token', succes.token);
            }
            this.router.navigate(['home']);
          }
        });
      } catch (err) {
        console.log(err);
        this.error = err.message;
        this.logging = false;
        // TODO: snackbar
        console.error('Erreur de connexion');
      }
    }
  }

  get passwordInvalid() {
    const control = this.loginForm.get('pass');
    return control.hasError('required') && control.touched;
  }

  get emailFormat() {
    const control = this.loginForm.get('user');
    return control.touched && control.hasError('required');
  }
}
