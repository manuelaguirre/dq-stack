import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../shared/shared.module';
import { NewFormComponent } from './new-form-component/new-form.component';
import { BackofficeService } from './services/backoffice.service';

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
    SharedModule,
  ],
})
export class DqBackofficeSharedModule {}
