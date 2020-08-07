import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { DqTheme } from '../../../../shared/models/dq-theme';
import { map } from 'rxjs/operators';

@Component({
  selector: 'dq-themes',
  templateUrl: 'dq-themes.component.html'
})

export class DqThemesComponent implements OnInit {
  themes$: Observable<DqTheme[]> = null;

  constructor(
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.themes$ = this.route.data.pipe(
      map((data: {themes: DqTheme[];}) => data.themes),
    );
  }
}
