import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  FormGroup, FormBuilder, Validators,
} from '@angular/forms';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { Title } from '@angular/platform-browser';
import { AuthService } from '../../auth-form/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;

  error: string;

  loging = false;

  constructor(
    private router: Router,
    private authService: AuthService,
    private fb: FormBuilder,
    private titleService: Title,
  ) {}

  ngOnInit() {
    this.titleService.setTitle('Back office - Login');
    this.loginForm = this.fb.group({
      user: ['', Validators.required],
      pass: ['', Validators.required],
    });
  }

  async login() {
    this.loging = true;
    if (this.loginForm.valid) {
      try {
        this.authService.signIn(this.loginForm.value.user, this.loginForm.value.pass).pipe(
          catchError((error) => {
              console.log(error);
              if (error.code && error.code === 'auth/wrong-password') {
                // TODO: snackbar
                console.log('User/Pass incorrect');
              } else {
                // TODO: snackbar
                console.log('Conexion error');
              }
              this.loging = false;
              return of(null);
          }),
        ).subscribe((succes) => {
          if (succes) {
            setTimeout(() => {
              this.router.navigate(['home']);
            }, 500);
          }
        });
      } catch (err) {
        console.log(err);
        this.error = err.message;
        this.loging = false;
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
