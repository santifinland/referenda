import { Component, OnInit } from '@angular/core';

import { CookiesService } from './../_services';


@Component({
  selector: 'app-cookie-consent',
  templateUrl: './cookie-consent.component.html',
  styleUrls: ['./cookie-consent.component.scss']
})
export class CookieConsentComponent implements OnInit {

  decided = true;

  constructor(private cookiesService: CookiesService) {
    this.decided = this.cookiesService.isCookieConsentDecided();
  }

  ngOnInit(): void { }

  cookies(accept: boolean): void {
    console.log(accept);
    this.cookiesService.setCookieConsent(accept);
    this.decided = true;
  }
}
