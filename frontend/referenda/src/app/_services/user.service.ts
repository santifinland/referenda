﻿import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { catchError} from 'rxjs/operators';
import { Observable, of } from 'rxjs';

import { environment } from '../../environments/environment';
import { Party } from '../_models';
import { User } from '../_models';


@Injectable({ providedIn: 'root' })
export class UserService {
  constructor(private http: HttpClient) { }

  private usersUrl = environment.baseUrl + '/users';

  delegatedParty(): Observable<Party> {
    return this.http.get<Party>(this.usersUrl + '/delegateparty')
      .pipe(
        catchError(this.handleError<Party>('delegatedParty'))
      );
  }

  delegatedUser(): Observable<User> {
    return this.http.get<User>(this.usersUrl + '/delegateuser')
      .pipe(
        catchError(this.handleError<User>('delegatedUser'))
      );
  }

  delegateParty(party: string): Observable<string> {
    const uri = this.usersUrl + '/delegateparty';
    const body = {'party': party};
    return this.http.post<string>(uri, body);
  }

  delegateUser(username: string): Observable<string> {
      const uri = this.usersUrl + '/delegateuser';
      const body = {'username': username};
      return this.http.post<string>(uri, body);
  }

  findUser(username: string): Observable<User[]> {
    const uri = this.usersUrl + '/find/' + username;
    console.log(uri);
    return this.http.get<User[]>(uri);
  }

  register(user: User) {
    return this.http.post(`${this.usersUrl}/register`, user);
  }

  googleRegister(user: any): Observable<string> {
    const uri = this.usersUrl + '/googleregister';
    console.log(user)
    console.log(user.idToken)
    console.log(user.authToken)
    console.log(user.name)
    const body = {'id': user.idToken, 'token': user.authToken, 'username': user.name, 'consent': true};
    return this.http.post<string>(uri, body);
  }

  facebookRegister(user: any): Observable<string> {
    const uri = this.usersUrl + '/facebookregister';
    const body = {'token': user.authToken, 'email': user.email, 'username': user.name, 'consent': true};
    return this.http.post<string>(uri, body);
  }

  rememberPassword(email: string) {
    return this.http.post(`${this.usersUrl}/password`, email);
  }

  setPassword(password: any) {
    const uri = this.usersUrl + '/set-password';
    const body = {'token': password.token, 'password': password.password};
    return this.http.post<string>(uri, body);
  }

  changeUsername(username: string) {
    const uri = this.usersUrl + '/username';
    const body = {'username': username};
    return this.http.post<string>(uri, body);
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
