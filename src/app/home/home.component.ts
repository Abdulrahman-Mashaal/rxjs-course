import {Component, OnInit} from '@angular/core';
import {Course} from "../model/course";
import {interval, Observable, of, timer} from 'rxjs';
import {catchError, delayWhen, filter, map, retryWhen, shareReplay, tap} from 'rxjs/operators';
import { noop } from 'rxjs';
import { createHttpObservable } from '../common/util';

@Component({
    selector: 'home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css'],
    standalone: false
})
export class HomeComponent implements OnInit {

    beginnerCourses: Course[];
    advancedCourses: Course[];
    constructor() {
  
    }

    ngOnInit() {
  

        const http$ = createHttpObservable('/api/courses');
        const courses$ = http$
        .pipe(
          map(res => Object.values(res.payload) as any[])
        );
        courses$.subscribe(
          courses => {
            this.beginnerCourses = courses.filter(course => course.category === 'BEGINNER');
            this.advancedCourses = courses.filter(course => course.category === 'ADVANCED');
          },
          noop, // noop is a function that does nothing
          () => console.log('Completed') // empty function
        )

    }

}
