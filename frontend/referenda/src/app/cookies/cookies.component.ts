import {Component, Inject, OnInit, PLATFORM_ID} from '@angular/core';
import {isPlatformBrowser} from '@angular/common';
import {Meta, Title} from '@angular/platform-browser';


import {CookiesService, WINDOW} from '../_services';
import {ActivatedRoute, Router} from "@angular/router";


@Component({
  selector: 'app-cookies',
  templateUrl: './cookies.component.html',
  styleUrls: ['./cookies.component.css']
})
export class CookiesComponent implements OnInit {

  cookieConsent: boolean;
  decided = false;
  decidedNow = false;
  returnUrl: string;

  constructor(
    private metaTagService: Meta,
    private titleService: Title,
    private cookiesService: CookiesService,
    private route: ActivatedRoute,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object,
    @Inject(WINDOW) private window: Window) {
    this.decided = this.cookiesService.isCookieConsentDecided();
    this.decidedNow = false;
  }

  ngOnInit() {
    const title = 'Referenda. Política de Cookies';
    this.titleService.setTitle(title);
    this.metaTagService.updateTag({name: 'description', content: title});
    if (isPlatformBrowser(this.platformId)) {
      window.scroll({top: 0, behavior: 'smooth'});
    }
    if (this.decided) {
      this.cookieConsent = this.cookiesService.getCookieConsent();
    } else {
      this.cookieConsent = true;
    }
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  changeConsent(): void {
    this.cookieConsent = !this.cookieConsent;
    this.cookiesService.setCookieConsent(this.cookieConsent);
  }

  acceptAll(): void {
    this.cookieConsent = true;
    this.cookiesService.setCookieConsent(true);
    this.decided = true;
    this.decidedNow = true;
  }

  avoidAll(): void {
    this.cookieConsent = false;
    this.cookiesService.setCookieConsent(false);
    window['ga-disable-G-QT7CRQ57HF'] = true;
    this.decided = true;
    this.decidedNow = true;
  }

  return(): void {
    this.router.navigate(["/"]);
  }
}
