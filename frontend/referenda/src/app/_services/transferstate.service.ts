import {Inject, Injectable, PLATFORM_ID} from '@angular/core';
import {makeStateKey, StateKey, TransferState} from '@angular/platform-browser';
import {isPlatformServer} from '@angular/common';
import {Observable, of} from 'rxjs';
import {tap} from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class TransferStateService {

  private keys = new Map<string, StateKey<string>>();

  constructor(
    @Inject(PLATFORM_ID) private readonly platformId: Object,
    private readonly transferState: TransferState
  ) {}

  fetch<T>(
    key: string,
    observableInput: Observable<T>,
    defaultValue?: T
  ): Observable<T> {
    if (this.has(key)) {
      return of(this.get(key, defaultValue)).pipe(
        tap(() => this.remove(key))
      );
    }
    return observableInput.pipe(
      tap((value) => this.set(key, value))
    );
  }

  get<T>(
    key: string,
    defaultValue?: T | null
  ): T | null {
    if (!this.has(key)) {
      return defaultValue || null;
    }
    return this.transferState.get<T>(
      this.getStateKey(key),
      defaultValue
    );
  }

  has(key: string): boolean {
    return this.transferState.hasKey(this.getStateKey(key));
  }

  remove(key: string): void {
    if (!this.has(key)) {
      return;
    }
    this.transferState.remove(this.getStateKey(key));
  }

  set<T>(key: string, value: T): void {
    if (isPlatformServer(this.platformId)) {
      if (this.has(key)) {
        console.warn(
          `Setting existing value into TransferState using key: '${key}'`
        );
      }
      this.transferState.set(
        this.getStateKey(key),
        <any> value
      );
    }
  }

  private getStateKey(key: string): StateKey<string> {
    if (this.keys.has(key)) {
      return this.keys.get(key);
    }
    this.keys.set(key, makeStateKey(key));
    return this.keys.get(key);
  }
}
