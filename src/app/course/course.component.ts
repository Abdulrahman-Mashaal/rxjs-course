import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {Course} from "../model/course";
import {
    debounceTime,
    distinctUntilChanged,
    startWith,
    tap,
    delay,
    map,
    concatMap,
    switchMap,
    withLatestFrom,
    concatAll, shareReplay
} from 'rxjs/operators';
import {merge, fromEvent, Observable, concat} from 'rxjs';
import {Lesson} from '../model/lesson';
import { createHttpObservable } from '../common/util';


@Component({
    selector: 'course',
    templateUrl: './course.component.html',
    styleUrls: ['./course.component.css'],
    standalone: false
})
export class CourseComponent implements OnInit, AfterViewInit {

    courseId: string;
    course$: Observable<Course>;
    lessons$: Observable<Lesson[]>;


    @ViewChild('searchInput', { static: true }) input: ElementRef;

    constructor(private route: ActivatedRoute) {


    }

    ngOnInit() {
this.courseId = this.route.snapshot.params['id'];
this.course$ = createHttpObservable(`/api/courses/${this.courseId}`)
;

    }

    ngAfterViewInit() {

        this.lessons$ = fromEvent<any>(this.input.nativeElement, 'keyup')
        .pipe(
            map((event: any) => event.target.value),
            startWith(''), // initial value
            debounceTime(400), // wait 400ms after the last keyup event before emitting the value
            distinctUntilChanged(), // only emit if the value is different from the previous one
            switchMap(searchTerm => this.loadLessons(searchTerm))
    );
}

    private loadLessons(search:string='') : Observable<Lesson[]> {
        return createHttpObservable(`/api/lessons?courseId=${this.courseId}&pageSize=100&filter=${search}`).pipe(
            map(res => res['payload'])
            )
    }

}
