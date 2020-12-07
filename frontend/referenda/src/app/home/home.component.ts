import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { SocialAuthService, SocialUser } from 'angularx-social-login';

import { AuthenticationService } from '../_services';
import { Party } from '../_models';
import { User } from '../_models';
import { UserService } from '../_services';


@Component({
  templateUrl: 'home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {

  currentUser: User;
  currentUserSubscription: Subscription;
  delegation = 'none';
  delegatedPartyValue: Party;
  delegatedUserValue: User;

  private socialUser: SocialUser;
  private socialUserLoggedIn: boolean;
  private socialProvider: string;

  constructor(
    private authenticationService: AuthenticationService,
    private authService: SocialAuthService,
    private userService: UserService) {
    this.currentUserSubscription = this.authenticationService.currentUser.subscribe(user => {
      console.log(user);
      this.currentUser = user;
      this.delegatedParty();
      this.delegatedUser();
    });
  }

  ngOnInit() { }

  ngOnDestroy() {
      // unsubscribe to ensure no memory leaks
      this.currentUserSubscription.unsubscribe();
  }

  delegatedParty(): void {
    this.userService.delegatedParty()
      .subscribe(
        (data: any) => {
          if (data) {
            console.log(data);
            this.delegatedPartyValue = data;
            this.delegation = 'party';
            if (data.name === 'nd') {
              this.delegation = 'none';
            }
          }
        },
        err => {}
      );
  }

  delegatedUser(): void {
    this.userService.delegatedUser()
      .subscribe(
        (data: any) => {
          if (data) {
            this.delegatedUserValue = data;
            this.delegation = 'user';
          }
        },
        err => {}
      );
  }

  logout() {
    this.authenticationService.logout();
    this.currentUserSubscription.unsubscribe();
    if (this.socialUser) {
      this.socialUserLoggedIn = false;
      this.socialUser = null;
      this.authService.signOut();
    }
    location.reload();
  }
}
