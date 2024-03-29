﻿import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { CookieService } from 'ngx-cookie-service';


@Injectable({ providedIn: 'root' })
export class CookiesService {

  REFERENDA_CONSENT = 'referendaConsent';
  REFERENDA_LANDING = 'referendaLanding';

  private cookiesDecided = new BehaviorSubject('not decided');
  cookiesDecidedMessage = this.cookiesDecided.asObservable();

  constructor(private cookieService: CookieService) {  }

  public getCookieConsent(): boolean {
    return this.checkConsentFromCookie();
  }

  public setCookieConsent(decision: boolean) {
      this.cookieService.set(this.REFERENDA_CONSENT,
                             decision ? 'true' : 'false',
                             40,
                             '/',
                             'referenda.es',
                             true,
                             'None');
      this.cookiesDecided.next('decided');
  }

  public isCookieConsentDecided(): boolean {
    return this.cookieService.check(this.REFERENDA_CONSENT);
  }

  checkConsentFromCookie(): boolean {
    if (this.cookieService.check(this.REFERENDA_CONSENT)) {
      const cookieConsent = this.cookieService.get(this.REFERENDA_CONSENT);
      return cookieConsent === 'true';
    } else {
      return false;
    }
  }

  public getLanding(): boolean {
    if (this.cookieService.check(this.REFERENDA_LANDING)) {
      const landing = parseInt(this.cookieService.get(this.REFERENDA_LANDING), 10);
      return landing > 3;
    } else {
      return false;
    }
  }

  public setLanding(): void {
    if (this.cookieService.check(this.REFERENDA_LANDING)) {
      const landing: number = parseInt(this.cookieService.get(this.REFERENDA_LANDING), 10) + 1;
      this.cookieService.set(this.REFERENDA_LANDING, landing.toString());
    } else {
      this.cookieService.set(this.REFERENDA_LANDING, '1');
    }
  }

}
