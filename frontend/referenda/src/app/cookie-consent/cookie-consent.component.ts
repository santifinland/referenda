import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { CookiesService } from '../_services';


@Component({
  selector: 'app-cookie-consent',
  templateUrl: './cookie-consent.component.html',
  styleUrls: ['./cookie-consent.component.scss']
})
export class CookieConsentComponent implements OnInit {

  decided = true;

  constructor(
      private cookiesService: CookiesService,
      private router: Router) {
    this.decided = this.cookiesService.isCookieConsentDecided();
  }

  ngOnInit(): void { }

  configure(): void {
    this.cookiesService.setCookieConsent(true);
    this.decided = true;
    this.router.navigateByUrl('/cookies');
  }

  cookies(accept: boolean): void {
    this.cookiesService.setCookieConsent(accept);
    this.decided = true;
  }
}
