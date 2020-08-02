import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'dq-back-office',
  templateUrl: './back-office.component.html'
})

export class BackOficeComponent implements OnInit {
  constructor(
    private titleService: Title,
  ) {
    this.titleService.setTitle('DefiQuiz back office');
  }

  ngOnInit() { }
}
