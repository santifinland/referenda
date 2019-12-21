import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import { AuthService } from 'angularx-social-login';
import { FacebookLoginProvider, GoogleLoginProvider} from 'angularx-social-login';
import { first } from 'rxjs/operators';
import { Subscription } from 'rxjs';

import {AlertService, AuthenticationService, UserService} from '../_services';
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

  private socialProvider: string;

  constructor(
      private alertService: AlertService,
      private authenticationService: AuthenticationService,
      private authService: AuthService,
      private formBuilder: FormBuilder,
      private route: ActivatedRoute,
      private router: Router) {
    // redirect to home if already logged in
    if (this.authenticationService.currentUserValue) {
      this.router.navigate(['/']);
    }
  }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
        username: ['', Validators.required],
        password: ['', Validators.required]
    });
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
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
  }

  signInWithFB(): void {
    this.socialProvider = 'Facebook';
    this.authService.signIn(FacebookLoginProvider.PROVIDER_ID);
  }
}
