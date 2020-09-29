import { NgModule } from '@angular/core';

import { DqImageHandlerComponent } from './dq-image-handler.component';
import { CommonModule } from '@angular/common';
import { BackofficeService } from '../services/backoffice.service';

@NgModule({
  imports: [
    CommonModule,
  ],
  exports: [
    DqImageHandlerComponent,
  ],
  declarations: [
    DqImageHandlerComponent,
  ],
  providers: [
    BackofficeService,
  ],
})
export class DqImageHandlerModule { }
