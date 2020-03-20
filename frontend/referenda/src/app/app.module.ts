import { APP_BASE_HREF } from '@angular/common';
import { BrowserModule, Title } from '@angular/platform-browser';
import { FilterPipeModule } from 'ngx-filter-pipe';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgModule } from '@angular/core';
import { OrderModule } from 'ngx-order-pipe';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { D3Service } from 'd3-ng2-service';
import { GoogleLoginProvider, FacebookLoginProvider } from 'angularx-social-login';
import { NgcCookieConsentModule, NgcCookieConsentConfig } from 'ngx-cookieconsent';
import { SocialLoginModule, AuthServiceConfig } from 'angularx-social-login';
import { FroalaEditorModule, FroalaViewModule } from 'angular-froala-wysiwyg';

import { AdminLawComponent } from './admin-law/admin-law.component';
import { CreateLawComponent } from './create-law/create-law.component';
import { AlertComponent } from './_components';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { DelegationsComponent } from './delegations/delegations.component';
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';
import { LawDetailComponent } from './law-detail/law-detail.component';
import { LawsComponent } from './laws/laws.component';
import { ModalComponent } from './_directives';
import { ModalService } from './_services';
import { JwtInterceptor, ErrorInterceptor } from './_helpers';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login';
import { PasswordComponent } from './password/password.component';
import { ProfileComponent } from './profile/profile.component';
import { RegisterComponent } from './register';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { ResultsComponent } from './results/results.component';
import { WINDOW_PROVIDERS } from './_services/window.service';


const cookieConfig: NgcCookieConsentConfig = {
  cookie: {
    domain: 'referenda.es' // it is mandatory to set a domain, for cookies to work properly (see https://goo.gl/S2Hy2A)
  },
  theme: 'block',
  palette: {
    popup: {
      background: '#3D989D'
    },
    button: {
      background: '#f1d600'
    }
  },
  type: 'info'
};

const config = new AuthServiceConfig([
  {
    id: GoogleLoginProvider.PROVIDER_ID,
    provider: new GoogleLoginProvider('928349623718-lfcmf80du5n1r2agv00hecdtoqmtpd60.apps.googleusercontent.com')
  },
  {
    id: FacebookLoginProvider.PROVIDER_ID,
    provider: new FacebookLoginProvider('297519443717240')
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
    AdminLawComponent,
    CreateLawComponent,
    LawsComponent,
    LawDetailComponent,
    FooterComponent,
    HeaderComponent,
    ResultsComponent,
    DelegationsComponent,
    AlertComponent,
    ModalComponent,
    HomeComponent,
    LoginComponent,
    PasswordComponent,
    ProfileComponent,
    RegisterComponent,
    ResetPasswordComponent,
  ],
  imports: [
    AppRoutingModule,
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    FilterPipeModule,
    FormsModule,
    FroalaEditorModule.forRoot(),
    FroalaViewModule.forRoot(),
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
    { provide: APP_BASE_HREF, useValue: '/' },
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    D3Service,
    ModalService,
    { provide: AuthServiceConfig, useFactory: provideConfig },
    Title,
    WINDOW_PROVIDERS
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
