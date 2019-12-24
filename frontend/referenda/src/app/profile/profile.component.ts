import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

import { AuthenticationService, UserService } from '../_services';
import { User } from '../_models';


@Component({ templateUrl: 'profile.component.html' })
export class ProfileComponent implements OnInit, OnDestroy {

  profileForm: FormGroup;
  submitted = false;

  currentUser: User;
  currentUserSubscription: Subscription;

  constructor(
      private authenticationService: AuthenticationService,
      private formBuilder: FormBuilder,
      private userService: UserService,
  ) {
      this.currentUserSubscription = this.authenticationService.currentUser.subscribe(user => {
          this.currentUser = user;
      });
  }

  ngOnInit() {
    this.profileForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(15)]]
    });
  }

  get pf() { return this.profileForm.controls; }

  onChangeUsername() {

    this.submitted = true;

    if (this.profileForm.invalid) {
      return;
    }

    this.userService.changeUsername(this.pf.username.value)
      .subscribe(
        data => {
          var newUser = new User(this.pf.username.value, this.currentUser.token);
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


  ngOnDestroy() {
      this.currentUserSubscription.unsubscribe();
  }
}
