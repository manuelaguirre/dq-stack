import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatRadioModule } from '@angular/material/radio';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatCardModule } from '@angular/material/card';
import { MatStepperModule } from '@angular/material/stepper';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { SnackBarService } from './services/snack-bar.service';
import { ApiService } from './services/api.service';
import { ComponentUtilsService } from './services/component-utils';

const materialModules = [
  MatFormFieldModule,
  MatInputModule,
  ReactiveFormsModule,
  MatIconModule,
  FormsModule,
  MatSnackBarModule,
  MatSelectModule,
  MatTableModule,
  MatSortModule,
  MatRadioModule,
  DragDropModule,
  MatCardModule,
  MatStepperModule,
  MatCheckboxModule,
  MatDialogModule,
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
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class SharedModule { }
