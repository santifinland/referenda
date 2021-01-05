import { Component, Inject, Injector, OnInit, OnDestroy, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Meta, Title} from '@angular/platform-browser';
import { Router, NavigationEnd } from '@angular/router';

import { CookieService } from 'ngx-cookie-service';
import { Subscription } from 'rxjs/Subscription';

import { AuthenticationService, CookiesService } from './_services';
import { User } from './_models';
import { WINDOW } from './_services/window.service';


declare let gtag: Function;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {

  currentUser: User;
  ccService = null;
  title = 'Referenda | Democracia Directa';

  private popupOpenSubscription: Subscription;
  private popupCloseSubscription: Subscription;
  private initializeSubscription: Subscription;
  private statusChangeSubscription: Subscription;
  private revokeChoiceSubscription: Subscription;
  private noCookieLawSubscription: Subscription;

  constructor(
    private cookieService: CookieService,
    private cookiesService: CookiesService,
    private metaTagService: Meta,
    private titleService: Title,
    private authenticationService: AuthenticationService,
    public router: Router,
    @Inject(PLATFORM_ID) private readonly platformId: Object,
    @Inject(WINDOW) private window: Window,
    private readonly injector: Injector) {
      this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
      this.router.events.subscribe(event => {
        if((event instanceof NavigationEnd) && this.cookiesService.getCookieConsent()){
          gtag('config', 'G-QT7CRQ57HF', {'page_path': event.urlAfterRedirects});
        }
      })
      if (!this.cookiesService.getCookieConsent()) {
        window['ga-disable-G-QT7CRQ57HF'] = true;
      }
  }

  ngOnInit() {
    this.titleService.setTitle(this.title);
    this.metaTagService.updateTag({ name: 'description', content: this.title });
  }

  ngOnDestroy() { }
}
