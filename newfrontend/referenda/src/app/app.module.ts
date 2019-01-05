import { BrowserModule } from '@angular/platform-browser';
import { FilterPipeModule } from 'ngx-filter-pipe';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgcCookieConsentModule, NgcCookieConsentConfig } from 'ngx-cookieconsent';
import { NgModule } from '@angular/core';
import { OrderModule } from 'ngx-order-pipe';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CookiesComponent } from './cookies/cookies.component';
import { D3Service } from 'd3-ng2-service';
import { DelegationsComponent } from './delegations/delegations.component';
import { FooterComponent } from './footer/footer.component';
import { GoogleLoginProvider, FacebookLoginProvider } from "angularx-social-login";
import { HeaderComponent } from './header/header.component';
import { LawsComponent } from './laws/laws.component';
import { LawDetailComponent } from './law-detail/law-detail.component';
import { ResultsComponent } from './results/results.component';
import { SocialLoginModule, AuthServiceConfig } from "angularx-social-login";


import { StatsComponent } from './stats/stats.component';
import { AlertComponent } from './_components';
import { ModalComponent } from './_directives';
import { ModalService } from './_services';
import { JwtInterceptor, ErrorInterceptor } from './_helpers';
import { HomeComponent } from './home';
import { LoginComponent } from './login';
import { RegisterComponent } from './register';
import { GdprComponent } from './gdpr/gdpr.component';
import { AboutusComponent } from './aboutus/aboutus.component';
import { DevelopersComponent } from './developers/developers.component';


const cookieConfig:NgcCookieConsentConfig = {
  cookie: {
    domain: 'localhost' // or 'your.domain.com' // it is mandatory to set a domain, for cookies to work properly (see https://goo.gl/S2Hy2A)
  },
  palette: {
    popup: {
      background: '#000'
    },
    button: {
      background: '#f1d600'
    }
  },
  theme: 'edgeless',
  type: 'opt-out'
};

let config = new AuthServiceConfig([
  {
    id: GoogleLoginProvider.PROVIDER_ID,
    provider: new GoogleLoginProvider("928349623718-lfcmf80du5n1r2agv00hecdtoqmtpd60.apps.googleusercontent.com")
  },
  {
    id: FacebookLoginProvider.PROVIDER_ID,
    provider: new FacebookLoginProvider("Facebook-App-Id")
  }
]);

export function provideConfig() {
  return config;
}

// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(http);
}

@NgModule({
  declarations: [
    AppComponent,
    LawsComponent,
    LawDetailComponent,
    FooterComponent,
    HeaderComponent,
    CookiesComponent,
    ResultsComponent,
    DelegationsComponent,
    StatsComponent,
    AlertComponent,
    ModalComponent,
    HomeComponent,
    LoginComponent,
    RegisterComponent,
    GdprComponent,
    AboutusComponent,
    DevelopersComponent,
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    FilterPipeModule,
    FormsModule,
    HttpClientModule,
    NgbModule,
    OrderModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    ReactiveFormsModule,
    NgcCookieConsentModule.forRoot(cookieConfig),
    SocialLoginModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    D3Service,
    ModalService,
    { provide: AuthServiceConfig, useFactory: provideConfig }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
