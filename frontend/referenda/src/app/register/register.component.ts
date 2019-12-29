import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { AlertService, UserService, AuthenticationService } from '../_services';
import { AuthService, FacebookLoginProvider, GoogleLoginProvider, SocialUser } from 'angularx-social-login';
import { User} from '../_models';
import {Title} from "@angular/platform-browser";


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  registerForm: FormGroup;
  loading = false;
  submitted = false;

  private socialUser: SocialUser;
  private socialUserLoggedIn: boolean;
  private socialProvider: string;

  constructor(
      private alertService: AlertService,
      private authService: AuthService,
      private authenticationService: AuthenticationService,
      private formBuilder: FormBuilder,
      private route: ActivatedRoute,
      private router: Router,
      private titleService: Title,
      private userService: UserService,
  ) {
    if (this.authenticationService.currentUserValue) {
      this.router.navigate(['/']);
    }
  }

  ngOnInit() {
    const title = 'Regístrate en Referenda';
    this.titleService.setTitle(title);
    document.querySelector('meta[name="description"]').setAttribute('content', title);
    this.registerForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.minLength(4)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
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

  get rf() { return this.registerForm.controls; }

  onRegister() {
    this.submitted = true;

    if (this.registerForm.invalid) {
      return;
    }

    this.loading = true;
    this.userService.register(this.registerForm.value)
      .pipe(first())
      .subscribe(
        data => {
          this.alertService.success('Registro correcto.', true);
          this.router.navigate(['/login']);
        },
        error => {
          this.alertService.error(error);
          this.loading = false;
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
