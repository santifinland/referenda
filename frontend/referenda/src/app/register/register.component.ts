import {Component, Inject, OnInit,PLATFORM_ID} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {isPlatformBrowser} from '@angular/common';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {first} from 'rxjs/operators';
import {Meta, Title} from '@angular/platform-browser';

import {SocialAuthService, FacebookLoginProvider, GoogleLoginProvider, SocialUser} from 'angularx-social-login';

import {AlertService, UserService, AuthenticationService, WINDOW} from '../_services';
import {User } from '../_models';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  registerForm: FormGroup;
  socialRegisterForm: FormGroup;
  submitted = false;
  socialSubmitted = false;
  socialConsentNeeded = false;
  socialConsentGranted = false;
  refconsent = false;

  private socialUser: SocialUser;
  private socialUserLoggedIn: boolean;
  private socialProvider: string;
  private user;

  constructor(
      private alertService: AlertService,
      private authService: SocialAuthService,
      private authenticationService: AuthenticationService,
      private formBuilder: FormBuilder,
      private metaTagService: Meta,
      private route: ActivatedRoute,
      private router: Router,
      private titleService: Title,
      private userService: UserService,
      @Inject(PLATFORM_ID) private platformId: Object,
      @Inject(WINDOW) private window: Window
  ) {
    if (this.authenticationService.currentUserValue) {
      this.router.navigateByUrl('/leyes');
    }
  }

  ngOnInit() {
    const title = 'Regístrate en Referenda y empieza a votar';
    this.titleService.setTitle(title);
    this.metaTagService.updateTag({ name: 'description', content: title });
    if (isPlatformBrowser(this.platformId)) {
      window.scroll({top: 0, behavior: 'smooth'});
    }
    this.socialRegisterForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.minLength(4)]],
      consent: [false, [Validators.requiredTrue]]
    })
    this.registerForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.minLength(4)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      consent: ['', [Validators.requiredTrue]]
    });
    this.authService.authState.subscribe((user) => {
      this.socialUser = user;
      this.socialUserLoggedIn = (user != null);
      // Assure GDPR consent
      this.user = user;
      this.socialConsentNeeded = true;
    });
  }

  get rf() { return this.registerForm.controls; }
  get srf() { return this.socialRegisterForm.controls; }

  onRegister() {
    this.submitted = true;

    if (this.registerForm.invalid) {
      return;
    }

    this.userService.register(this.registerForm.value)
      .pipe(first())
      .subscribe(
        data => {
          this.alertService.success('Registro correcto.', true);
          this.router.navigate(['/login']);
        },
        error => {
          this.alertService.error(error);
        });
  }

  onSocialRegister() {
    this.socialSubmitted = true;

    if (this.socialRegisterForm.invalid) {
      return;
      this.socialConsentGranted = false;
    } else {
      this.socialConsentGranted = true;
      this.user.name = this.socialRegisterForm.controls.username.value
      if (this.socialProvider === 'Google') {
        this.userService.googleRegister(this.user)
          .subscribe(
            (data: any) => {
              const referendaUser: User = {username: data.username, token: data.token};
              this.authenticationService.loginWithToken(referendaUser);
              this.socialConsentNeeded = false;
            },
            err => console.log(err)
          );
      }
      if (this.socialProvider === 'Facebook' && this.socialConsentGranted) {
        this.userService.facebookRegister(this.user)
          .subscribe(
            (data: any) => {
              const referendaUser: User = {username: data.username, token: data.token};
              this.authenticationService.loginWithToken(referendaUser);
              this.socialConsentNeeded = false;
            },
            err => console.log(err)
          );
      }
      this.router.navigateByUrl('/leyes');
    }
  }

  signInWithGoogle(): void {
    this.socialProvider = 'Google';
    this.authService.signIn(GoogleLoginProvider.PROVIDER_ID);
  }

  signInWithFB(): void {
    this.socialProvider = 'Facebook';
    this.authService.signIn(FacebookLoginProvider.PROVIDER_ID);
  }

  gdprCompliant(): boolean {
    return this.submitted && this.registerForm.controls.consent.status !== 'VALID';
  }

  socialGdprCompliant(): boolean {
    return this.socialSubmitted && this.socialRegisterForm.controls.consent.status !== 'VALID';
  }
}
