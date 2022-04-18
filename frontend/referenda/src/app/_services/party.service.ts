import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { catchError} from 'rxjs/operators';
import { Observable, of } from 'rxjs';

import { environment } from '../../environments/environment';
import { Party } from '../_models';


@Injectable({ providedIn: 'root' })
export class PartyService { constructor(private http: HttpClient) { }

  private partiesUrl = environment.baseUrl + '/parties';

  getParties(): Observable<Party[]> {
    return this.http.get<Party[]>(this.partiesUrl)
      .pipe(
        catchError(this.handleError('parties', []))
      );
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
      // console.error(error); // log to console instead

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}
