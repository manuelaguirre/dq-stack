import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'dq-players',
  templateUrl: 'dq-players.component.html'
})

export class DqPlayersComponent implements OnInit {
  constructor(
    public router: Router,    
  ) { }

  ngOnInit() { }
}
