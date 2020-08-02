import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DqPlayersComponent } from '../components/containers/dq-players/dq-players.component';
import { DqBackofficeSharedModule } from '../components/shared/dq-backoffice-shared.module';

const routes: Routes = [
  { path: '', component: DqPlayersComponent },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    DqBackofficeSharedModule,
  ],
  exports: [],
  declarations: [
    DqPlayersComponent,
  ],
  providers: [],
})
export class DqPlayersModule { }
