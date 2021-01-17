import { catchError} from 'rxjs/operators';
import { HttpClient} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Subscription } from 'rxjs';

import { AuthenticationService } from './authentication.service';
import { environment } from '../../environments/environment';
import { Law, User, VoteResponse } from '../_models';

@Injectable({
  providedIn: 'root'
})

export class LawService {

  private lawsUrl = environment.baseUrl + '/laws';
  private publicLawsUrl = environment.publicUrl + '/laws';

  currentUser: User;
  currentUserSubscription: Subscription;

  constructor(private authenticationService: AuthenticationService, private http: HttpClient) {
    this.currentUserSubscription = this.authenticationService.currentUser.subscribe(user => {
      this.currentUser = user;
    });
  }

  getLaws(): Observable<Law[]> {
    return this.http.get<Law[]>(this.publicLawsUrl)
      .pipe(
        catchError(this.handleError('getLaws', []))
      );
  }

  getLatestLaws(): Observable<Law[]> {
    return this.http.get<Law[]>(this.publicLawsUrl + '/latest')
      .pipe(
        catchError(this.handleError('getLatestLaws', []))
      );
  }

  getAllLaws(): Observable<Law[]> {
    return this.http.get<Law[]>(this.publicLawsUrl + '?all=true')
      .pipe(
        catchError(this.handleError('getLaws', []))
      );
  }

  postLaw(law: Law): Observable<any> {
    const uri = this.lawsUrl;
    return this.http.post<VoteResponse>(uri, law);
  }

  putLaw(law: Law): Observable<any> {
    const uri = this.lawsUrl + '/ley/' + law.slug;
    return this.http.put<VoteResponse>(uri, law);
  }

  getResults(): Observable<Law[]> {
    return this.http.get<Law[]>(this.publicLawsUrl + '?results=true')
      .pipe(
        catchError(this.handleError('getResults', []))
      );
  }

  getLaw(slug: string): Observable<Law> {
    return this.http.get<Law>(this.publicLawsUrl + '/ley/' + slug)
      .pipe(
        catchError(this.handleError<Law>('getLaw slug=${slug}'))
      );
  }

  submitVote(slug: string, vote: number): Observable<VoteResponse> {
    const uri = this.lawsUrl + '/ley/' + slug + '/votes';
    const body = {'vote': vote};
    return this.http.post<VoteResponse>(uri, body);
  }

  comment(slug: string, c: string): Observable<any> {
    const uri = this.lawsUrl + '/ley/' + slug + '/comments';
    const body = {'comment': c};
    return this.http.post(uri, body);
  }

  voteComment(slug: string, commentId: string, vote: number): Observable<any> {
    const uri = this.lawsUrl + '/ley/' + slug + '/comments/' + commentId + '/votes';
    const body = {'vote': vote};
    return this.http.post(uri, body);
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}

