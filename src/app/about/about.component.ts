import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { createHttpObservable } from '../common/util';
import { noop } from 'rxjs';
import { map } from 'rxjs/operators';
@Component({
    selector: 'about',
    templateUrl: './about.component.html',
    styleUrls: ['./about.component.css'],
    standalone: false
})
export class AboutComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    const http$ = createHttpObservable('/api/courses');
    const courses$ = http$
    .pipe(
      map(res => Object.values(res.payload))
    );
    courses$.subscribe(
      courses => console.log(courses),
      noop, // noop is a function that does nothing
      () => console.log('Completed') // empty function
    )
  }
}
