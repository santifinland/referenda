import { Injectable } from '@angular/core';

import { CookieService } from 'ngx-cookie-service';


@Injectable({ providedIn: 'root' })
export class CookiesService {

  REFERENDA_CONSENT = 'referendaConsent';

  constructor(private cookieService: CookieService) {  }

  public getCookieConsent(): boolean {
    return this.checkConsentFromCookie();
  }

  public setCookieConsent(decision: boolean) {
      this.cookieService.set(this.REFERENDA_CONSENT,
                             decision ? 'true' : 'false',
                             {expires: 30});
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

}
