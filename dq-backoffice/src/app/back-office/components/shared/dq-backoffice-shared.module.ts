import { NgModule } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';
import { NewFormComponent } from './new-form-component/new-form.component';
import { BackofficeService } from './services/backoffice.service';
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
  ],
  declarations: [
    NewFormComponent,
  ],
  providers: [
    BackofficeService,
  ],
  exports: [
    NewFormComponent,
  ],
})
export class DqBackofficeSharedModule {}
