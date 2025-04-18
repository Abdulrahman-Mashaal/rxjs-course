import { Observable } from 'rxjs';

export function createHttpObservable(url: string): Observable<any> {
  return Observable.create(observer => {
    fetch(url)
      .then(res => res.json())
      .then(body => {
        observer.next(body);
        observer.complete();
    })
      .catch(error => observer.error(error))
  })
}

