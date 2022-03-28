import { Component, OnInit, OnDestroy } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { Subscription } from 'rxjs';

import { SocialAuthService, SocialUser } from 'angularx-social-login';

import { AuthenticationService, UserService } from '../_services';
import { Party, User } from '../_models';


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

  profileForm: FormGroup;
  submitted = false;

  private socialUser: SocialUser;
  private socialUserLoggedIn: boolean;

  constructor(
    private authenticationService: AuthenticationService,
    private authService: SocialAuthService,
    private formBuilder: FormBuilder,
    private userService: UserService) {
    this.currentUserSubscription = this.authenticationService.currentUser.subscribe(user => {
      this.currentUser = user;
      this.delegatedParty();
      this.delegatedUser();
    });
  }

  ngOnInit() {
    this.profileForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(15)]]
    });
  }

  ngOnDestroy() {
      this.currentUserSubscription.unsubscribe();
  }

  get pf() { return this.profileForm.controls; }

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

  onChangeUsername() {

    this.submitted = true;

    if (this.profileForm.invalid) {
      return;
    }

    if (this.pf.username.value !== this.currentUser.username) {
      this.userService.changeUsername(this.pf.username.value)
        .subscribe(
          data => {
            const newUser = new User(this.pf.username.value, this.currentUser.token);
            this.authenticationService.loginWithToken(newUser);
          },
          error => {
            this.submitted = false;
            this.profileForm = this.formBuilder.group({
              username: ['', Validators.required]
            });
            return true;
          });
    }
  }
}
