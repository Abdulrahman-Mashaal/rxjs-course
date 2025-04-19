import { Component, OnInit } from "@angular/core";
import { Course } from "../model/course";
import { interval, Observable, of, throwError, timer } from "rxjs";
import {
  catchError,
  finalize,
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
      catchError(err => {
        console.log('Error occurred', err);
        return throwError(err); // using throwError to throw the error to the next operator
      }),
      finalize(() => {
        console.log('Finalize executed...')
      }),
      tap(() => console.log('HTTP request executed')), // using for debugging purposes
      map((res) => Object.values(res['payload'] as Course[])),
      shareReplay(), // using to cache the response and avoid multiple requests
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
