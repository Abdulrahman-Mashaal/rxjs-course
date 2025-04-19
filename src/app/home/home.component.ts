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
  delay,
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
      // retryWhen operator is used to retry the request after a delay
      retryWhen(errors => errors.pipe(
        delayWhen(() => timer(2000))
      ))
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
