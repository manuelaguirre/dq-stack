import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentUtilsService } from './services/component-utils';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { ApiService } from './services/api.service';
import { SnackBarService } from './services/snack-bar.service';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSelectModule } from '@angular/material/select';

const materialModules = [
  MatFormFieldModule,
  MatInputModule,
  ReactiveFormsModule,
  MatIconModule,
  FormsModule,
  MatSnackBarModule,
  MatSelectModule,
];

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    ...materialModules,
  ],
  exports: [
    ...materialModules,
  ],
  declarations: [],
  providers: [
    ComponentUtilsService,
    ApiService,
    SnackBarService,
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class SharedModule { }
