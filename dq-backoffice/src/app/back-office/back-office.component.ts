import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';

@Component({
  selector: 'dq-back-office',
  templateUrl: './back-office.component.html'
})

export class BackOficeComponent implements OnInit {
  constructor(
    private titleService: Title,
    public router: Router,
  ) {
    this.titleService.setTitle('DefiQuiz back office');
  }

  ngOnInit() { }
}
