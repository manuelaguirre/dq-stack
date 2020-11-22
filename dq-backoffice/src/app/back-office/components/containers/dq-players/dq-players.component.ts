import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'dq-players',
  templateUrl: 'dq-players.component.html',
})

export class DqPlayersComponent {
  constructor(
    public router: Router,
  ) { }
}
