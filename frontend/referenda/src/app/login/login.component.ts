import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';

import { FacebookLoginProvider, GoogleLoginProvider, SocialAuthService, SocialUser } from 'angularx-social-login';
import { first } from 'rxjs/operators';
import { Subscription } from 'rxjs';

import { AlertService, AuthenticationService, UserService, WINDOW } from '../_services';
import { User } from '../_models';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  loading = false;
  submitted = false;
  returnUrl: string;

  currentUser: User;
  currentUserSubscription: Subscription;

  private socialUser: SocialUser;
  private socialUserLoggedIn: boolean;
  private socialProvider: string;

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
      @Inject(WINDOW) private window: Window) {
    this.currentUserSubscription = this.authenticationService.currentUser.subscribe(user => {
      this.currentUser = user;
    });
  }

  ngOnInit() {
    const title = 'Inicia sesión en Referenda';
    this.titleService.setTitle(title);
    this.metaTagService.updateTag({ name: 'description', content: title });
    window.scroll({top: 0, behavior: 'smooth'});
    this.loginForm = this.formBuilder.group({
        username: ['', Validators.required],
        password: ['', Validators.required]
    });
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    console.log(this.returnUrl);
    this.authService.authState.subscribe((user) => {
      this.socialUser = user;
      this.socialUserLoggedIn = (user != null);
      if (this.socialProvider === 'Google') {
        this.userService.googleRegister(user)
          .subscribe(
            (data: any) => {
              const referendaUser: User = {username: data.username, token: data.token};
              this.authenticationService.loginWithToken(referendaUser);
            },
            err => console.log(err)
          );
      }
      if (this.socialProvider === 'Facebook') {
        this.userService.facebookRegister(user)
          .subscribe(
            (data: any) => {
              const referendaUser: User = {username: data.username, token: data.token};
              this.authenticationService.loginWithToken(referendaUser);
            },
            err => console.log(err)
          );
      }
    });
  }

  get lf() { return this.loginForm.controls; }

  onLogin() {
    this.submitted = true;

    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;
    this.authenticationService.login(this.lf.username.value, this.lf.password.value)
      .pipe(first())
      .subscribe(
        data => {
          this.router.navigate([this.returnUrl]);
        },
        error => {
          this.submitted = false;
          this.loading = false;
          this.loginForm = this.formBuilder.group({
            username: ['', Validators.required],
            password: ['', Validators.required]
          });
          return true;
        });
  }

  signInWithGoogle(): void {
    this.socialProvider = 'Google';
    this.authService.signIn(GoogleLoginProvider.PROVIDER_ID);
    this.router.navigate([this.returnUrl]);
  }

  signInWithFB(): void {
    this.socialProvider = 'Facebook';
    this.authService.signIn(FacebookLoginProvider.PROVIDER_ID);
    this.router.navigate([this.returnUrl]);
  }
}
