import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import { AuthService } from "angularx-social-login";
import { FacebookLoginProvider, GoogleLoginProvider, LinkedInLoginProvider } from "angularx-social-login";
import { first } from 'rxjs/operators';
import { SocialUser } from "angularx-social-login";
import { Subscription } from 'rxjs';

import { AlertService, AuthenticationService, UserService } from '../_services';
import { ModalService } from '../_services';
import { User } from '../_models';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  loginForm: FormGroup;
  registerForm: FormGroup;
  loading = false;
  submitted = false;

  currentUser: User;
  currentUserSubscription: Subscription;

  section: string;

  private socialUser: SocialUser;
  private socialUserLoggedIn: boolean;
  private socialProvider: string;

  constructor(
      private alertService: AlertService,
      private authService: AuthService,
      private authenticationService: AuthenticationService,
      private formBuilder: FormBuilder,
      private modalService: ModalService,
      private route: ActivatedRoute,
      private router: Router,
      private userService: UserService) {
    this.currentUserSubscription = this.authenticationService.currentUser.subscribe(user => {
      this.currentUser = user;
    });
  }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
    this.registerForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.minLength(4)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      gdpr: ['', Validators.required]
    });
    this.authService.authState.subscribe((user) => {
      this.socialUser = user;
      this.socialUserLoggedIn = (user != null);
      if (this.socialProvider == "Google") {
        this.userService.googleRegister(user)
          .subscribe(
            (data: any) => {
              const referendaUser: User = {username: data.username, token: data.token}
              this.authenticationService.loginWithToken(referendaUser);
              this.closeModal('login');
            },
            err => console.log(err)
          );
      }
      if (this.socialProvider == "Facebook") {
        this.userService.facebookRegister(user)
          .subscribe(
            (data: any) => {
              const referendaUser: User = {username: data.username, token: data.token}
              this.authenticationService.loginWithToken(referendaUser);
              this.closeModal('login');
            },
            err => console.log(err)
          );
      }
    });
  }

  get f() { return this.loginForm.controls; }
  get rf() { return this.registerForm.controls; }

  onLogin() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;
    this.authenticationService.login(this.f.username.value, this.f.password.value)
      .pipe(first())
      .subscribe(
        data => {
          this.closeModal('login');
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

  onRegister() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.registerForm.invalid) {
      return;
    }

    this.loading = true;
    this.userService.register(this.registerForm.value)
      .pipe(first())
      .subscribe(
        data => {
          this.alertService.success('Registration successful', true);
          this.router.navigate(['/']);
        },
        error => {
          this.alertService.error(error);
          this.loading = false;
        });
  }

  openModal(id: string) {
    this.modalService.open(id);
  }

  closeModal(id: string) {
    this.modalService.close(id);
  }

  logout() {
    this.authenticationService.logout();
    this.currentUserSubscription.unsubscribe();
    if (this.socialUser) {
      this.socialUserLoggedIn = false;
      this.socialUser = null;
      this.authService.signOut();
    }
    location.reload(true);
  }

  signInWithGoogle(): void {
    this.socialProvider = "Google";
    this.authService.signIn(GoogleLoginProvider.PROVIDER_ID);
  }

  signInWithFB(): void {
    this.socialProvider = "Facebook";
    this.authService.signIn(FacebookLoginProvider.PROVIDER_ID);
  }
}
