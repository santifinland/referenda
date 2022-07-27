import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

import { CookiesService } from '../_services';


@Component({
  selector: 'app-cookie-consent',
  templateUrl: './cookie-consent.component.html',
  styleUrls: ['./cookie-consent.component.scss']
})
export class CookieConsentComponent implements OnInit {

  decided = true;
  currentUrl: string;

  constructor(
      private cookiesService: CookiesService,
      private route: ActivatedRoute,
      private router: Router) {
    this.decided = this.cookiesService.isCookieConsentDecided();
    this.currentUrl = this.route.snapshot.url.toString();
  }

  ngOnInit(): void {
    this.cookiesService.cookiesDecidedMessage.subscribe(x => {
      if (x == 'decided') {
        this.decided = true;
      }
    })
  }

  cookies(accept: boolean): void {
    this.cookiesService.setCookieConsent(accept);
    this.decided = true;
  }
}
