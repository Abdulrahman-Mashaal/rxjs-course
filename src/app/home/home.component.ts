import { Component, OnInit } from "@angular/core";
import { Course } from "../model/course";
import { interval, Observable, of, timer } from "rxjs";
import {
  catchError,
  delayWhen,
  filter,
  map,
  retryWhen,
  shareReplay,
  tap,
} from "rxjs/operators";
import { createHttpObservable } from "../common/util";

@Component({
  selector: "home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"],
  standalone: false,
})
export class HomeComponent implements OnInit {
  beginnerCourses$: Observable<Course[]>;
  advancedCourses$: Observable<Course[]>;
  constructor() {}
  ngOnInit() {
    const http$: Observable<Course[]> = createHttpObservable("/api/courses");
    const courses$: Observable<Course[]> = http$.pipe(
      tap(() => console.log('HTTP request executed')), // using for debugging purposes
      map((res) => Object.values(res['payload'] as Course[])),
      shareReplay(), // using to cache the response and avoid multiple requests
      // alternative error response 
      // fetches data form an offline database when the network is down
      catchError(err => of([
        {
          id: 0,
        description: "RxJs In Practice Course",
        iconUrl: 'https://s3-us-west-1.amazonaws.com/angular-university/course-images/rxjs-in-practice-course.png',
        courseListIcon: 'https://angular-academy.s3.amazonaws.com/main-logo/main-page-logo-small-hat.png',
        longDescription: "Understand the RxJs Observable pattern, learn the RxJs Operators via practical examples",
        category: 'BEGINNER',
        lessonsCount: 10
        }
      ]))
    );
    // Observable definition
    this.beginnerCourses$ = courses$.pipe(
      map((courses) =>
        courses.filter((course) => course.category === "BEGINNER")
      )
    );
    // Observable definition
    this.advancedCourses$ = courses$.pipe(
      map((courses) =>
        courses.filter((course) => course.category === "ADVANCED")
      )  
    );
  }
}
