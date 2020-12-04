import { Component, Inject, Injector, OnInit, OnDestroy, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { NgcCookieConsentService,
         NgcInitializeEvent,
         NgcStatusChangeEvent,
         NgcNoCookieLawEvent} from 'ngx-cookieconsent';
import { Subscription } from 'rxjs/Subscription';
import { TranslateService } from '@ngx-translate/core';

import { AuthenticationService } from './_services';
import { User } from './_models';
import {Meta, Title} from '@angular/platform-browser';


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
    private metaTagService: Meta,
    private titleService: Title,
    private authenticationService: AuthenticationService,
    private translateService: TranslateService,
    @Inject(PLATFORM_ID) private readonly platformId: Object,
    private readonly injector: Injector) {
      this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
  }

  ngOnInit() {
    this.titleService.setTitle(this.title);
    this.metaTagService.updateTag({ name: 'description', content: this.title });

    if (!isPlatformBrowser(this.platformId)) {
      return;
    } else {

      this.ccService = this.injector.get(NgcCookieConsentService);

      // Support for translated cookies messages
      this.translateService.addLangs(['en', 'es']);
      this.translateService.setDefaultLang('en');

      const browserLang = this.translateService.getBrowserLang();
      this.translateService.use(browserLang.match(/en|es/) ? browserLang : 'en');

      this.translateService//
        .get(['cookie.header', 'cookie.message', 'cookie.dismiss', 'cookie.allow', 'cookie.deny', 'cookie.link', 'cookie.href'])
        .subscribe(data => {

          this.ccService.getConfig().content = this.ccService.getConfig().content || {} ;
          // Override default messages with the translated ones
          this.ccService.getConfig().content.header = data['cookie.header'];
          this.ccService.getConfig().content.message = data['cookie.message'];
          this.ccService.getConfig().content.dismiss = data['cookie.dismiss'];
          this.ccService.getConfig().content.allow = data['cookie.allow'];
          this.ccService.getConfig().content.deny = data['cookie.deny'];
          this.ccService.getConfig().content.link = data['cookie.link'];
          this.ccService.getConfig().content.href = data['cookie.href'];

          this.ccService.destroy(); // Remove previous cookie bar (with default messages)
          this.ccService.init(this.ccService.getConfig()); // update config with translated messages
        });

      // subscribe to cookieconsent observables to react to main events
      this.popupOpenSubscription = this.ccService.popupOpen$.subscribe(
        () => {
          // you can use this.ccService.getConfig() to do stuff...
        });

      this.popupCloseSubscription = this.ccService.popupClose$.subscribe(
        () => {
          // you can use this.ccService.getConfig() to do stuff...
        });

      this.initializeSubscription = this.ccService.initialize$.subscribe(
        (event: NgcInitializeEvent) => {
          // you can use this.ccService.getConfig() to do stuff...
        });

      this.statusChangeSubscription = this.ccService.statusChange$.subscribe(
        (event: NgcStatusChangeEvent) => {
          // you can use this.ccService.getConfig() to do stuff...
        });

      this.revokeChoiceSubscription = this.ccService.revokeChoice$.subscribe(
        () => {
          // you can use this.ccService.getConfig() to do stuff...
        });

      this.noCookieLawSubscription = this.ccService.noCookieLaw$.subscribe(
        (event: NgcNoCookieLawEvent) => {
          // you can use this.ccService.getConfig() to do stuff...
        });
    }
  }

  ngOnDestroy() {
    // unsubscribe to cookieconsent observables to prevent memory leaks
    if (isPlatformBrowser(this.platformId)) {
      this.popupOpenSubscription.unsubscribe();
      this.popupCloseSubscription.unsubscribe();
      this.initializeSubscription.unsubscribe();
      this.statusChangeSubscription.unsubscribe();
      this.revokeChoiceSubscription.unsubscribe();
      this.noCookieLawSubscription.unsubscribe();
    }
  }
}
