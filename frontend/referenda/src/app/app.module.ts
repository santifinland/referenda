import { APP_BASE_HREF, registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';
import {BrowserModule, Title} from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { LOCALE_ID, NgModule } from '@angular/core';
import {provideClientHydration} from '@angular/platform-browser';

import { AngularEditorModule } from '@kolkov/angular-editor';
import { CookieService } from 'ngx-cookie-service';
import { SocialLoginModule, SocialAuthServiceConfig } from '@abacritt/angularx-social-login';
import { GoogleSigninButtonModule } from '@abacritt/angularx-social-login';
import { GoogleLoginProvider, FacebookLoginProvider } from '@abacritt/angularx-social-login';


import { AdminLawComponent } from './admin-law/admin-law.component';
import { AlertComponent } from './_components';
import { CookieConsentComponent } from './cookie-consent/cookie-consent.component';
import { CreateLawComponent } from './create-law/create-law.component';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { DelegationsComponent } from './delegations/delegations.component';
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';
import { LawsComponent } from './laws/laws.component';
import { WINDOW_PROVIDERS } from './_services';
import { JwtInterceptor, ErrorInterceptor } from './_helpers';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login';
import { PartiesComponent } from './parties/parties.component';
import { PasswordComponent } from './password/password.component';
import { RegisterComponent } from './register';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { ResultsComponent } from './results/results.component';


registerLocaleData(localeEs);

@NgModule({
  declarations: [
    AppComponent,
    AdminLawComponent,
    CookieConsentComponent,
    CreateLawComponent,
    LawsComponent,
    FooterComponent,
    HeaderComponent,
    ResultsComponent,
    DelegationsComponent,
    AlertComponent,
    HomeComponent,
    LoginComponent,
    PartiesComponent,
    PasswordComponent,
    RegisterComponent,
    ResetPasswordComponent,
  ],
  imports: [
    AngularEditorModule,
    AppRoutingModule,
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    SocialLoginModule,
    GoogleSigninButtonModule
  ],
  providers: [
    { provide: APP_BASE_HREF, useValue: '/' },
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    { provide: LOCALE_ID, useValue: 'es-ES'},
    provideClientHydration(),
    CookieService,
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider('928349623718-lfcmf80du5n1r2agv00hecdtoqmtpd60.apps.googleusercontent.com')
          },
          {
            id: FacebookLoginProvider.PROVIDER_ID,
            provider: new FacebookLoginProvider('297519443717240')
          }
        ],
        onError: (err) => {
          console.error(err);
        }
      } as SocialAuthServiceConfig,
    },
    Title,
    WINDOW_PROVIDERS
  ],
  exports: [
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
