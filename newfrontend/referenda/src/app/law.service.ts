import { catchError, map, tap } from 'rxjs/operators';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Subscription } from 'rxjs';

import { AuthenticationService } from './_services';
import { Law } from './law';
import { User } from './_models';
import { Vote } from './vote';
import { VoteResponse } from './vote.response';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class LawService {

  private lawsUrl = 'https://referenda.es:3443/api/laws';

  currentUser: User;
  currentUserSubscription: Subscription;

  constructor(private authenticationService: AuthenticationService, private http: HttpClient) {
    this.currentUserSubscription = this.authenticationService.currentUser.subscribe(user => {
      this.currentUser = user;
    });
  }

  getLaws(): Observable<Law[]> {
    return this.http.get<Law[]>(this.lawsUrl)
      .pipe(
        catchError(this.handleError('getLaws', []))
      );
  }

  getLaw(slug: string): Observable<Law> {
    return this.http.get<Law>(this.lawsUrl + "/" + slug)
      .pipe(
        catchError(this.handleError<Law>('getLaw slug=${slug}'))
      );
  }

  submitVote(slug: string, vote: number): Observable<VoteResponse> {
    const uri = this.lawsUrl + "/" + slug + "/votes"
    const body = {"vote": vote}
    return this.http.post<VoteResponse>(uri, body)
  }

  comment(slug: string, c: string): Observable<any> {
    const uri = this.lawsUrl + "/" + slug + "/comments"
    const body = {"comment": c}
    return this.http.post(uri, body)
  }

  voteComment(slug: string, commentId: string, vote: number): Observable<any> {
    const uri = this.lawsUrl + "/" + slug + "/comments/" + commentId + "/votes"
    const body = {"vote": vote}
    return this.http.post(uri, body)
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

