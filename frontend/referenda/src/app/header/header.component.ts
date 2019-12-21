import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import { AuthService } from 'angularx-social-login';
import { SocialUser } from 'angularx-social-login';
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
}
