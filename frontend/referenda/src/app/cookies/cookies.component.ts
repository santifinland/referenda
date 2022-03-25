import {Component, Inject, OnInit, PLATFORM_ID} from '@angular/core';
import {isPlatformBrowser} from '@angular/common';
import {Meta, Title} from '@angular/platform-browser';


import {CookiesService, WINDOW} from '../_services';


@Component({
  selector: 'app-cookies',
  templateUrl: './cookies.component.html',
  styleUrls: ['./cookies.component.css']
})
export class CookiesComponent implements OnInit {

  cookieConsent: boolean;
  decided = false;

  constructor(
      private metaTagService: Meta,
      private titleService: Title,
      private cookiesService: CookiesService,
      @Inject(PLATFORM_ID) private platformId: Object,
      @Inject(WINDOW) private window: Window) {
    this.decided = this.cookiesService.isCookieConsentDecided();
  }

  ngOnInit() {
    const title = 'Referenda. Política de Cookies';
    this.titleService.setTitle(title);
    this.metaTagService.updateTag({ name: 'description', content: title });
    if (isPlatformBrowser(this.platformId)) {
      window.scroll({top: 0, behavior: 'smooth'});
    }
    if (this.decided) {
      this.cookieConsent = this.cookiesService.getCookieConsent();
    } else {
      this.cookieConsent = true;
    }
  }

  changeConsent(): void {
    this.cookieConsent = !this.cookieConsent;
    this.cookiesService.setCookieConsent(this.cookieConsent);
  }
}
