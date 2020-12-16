import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../shared/shared.module';
import { NewFormComponent } from './new-form-component/new-form.component';
import { BackofficeService } from './services/backoffice.service';
import { PlayersService } from './services/players.service';

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
    PlayersService,
  ],
  exports: [
    NewFormComponent,
    SharedModule,
  ],
})
export class DqBackofficeSharedModule {}
