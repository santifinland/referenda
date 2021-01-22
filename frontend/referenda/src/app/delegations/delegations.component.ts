import { Component, OnInit} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Meta, Title } from '@angular/platform-browser';

import {FacebookLoginProvider, GoogleLoginProvider, SocialAuthService} from 'angularx-social-login';
import {first} from 'rxjs/operators';

import { AuthenticationService } from '../_services';
import { ModalService } from '../_services';
import { Party } from '../_models';
import { User } from '../_models';
import { UserService } from '../_services';


@Component({
  selector: 'app-delegations',
  templateUrl: './delegations.component.html',
  styleUrls: ['./delegations.component.css']
})
export class DelegationsComponent implements OnInit {

  currentUser: User;
  currentUserSubscription: Subscription;

  initialState = true;

  delegation = 'none';
  delegatedPartyValue: Party;
  delegatedUserValue: User;
  tentativeUser = '';

  findUsersForm: FormGroup;
  submitted = false;
  foundUsers: User[] = [];
  loginForm: FormGroup;
  private socialProvider: string;

  constructor(
      private authenticationService: AuthenticationService,
      private authService: SocialAuthService,
      private formBuilder: FormBuilder,
      private metaTagService: Meta,
      private modalService: ModalService,
      private titleService: Title,
      private userService: UserService) {
    this.currentUserSubscription = this.authenticationService.currentUser.subscribe(user => {
      this.currentUser = user;
      this.delegatedParty();
      this.delegatedUser();
    });
  }

  ngOnInit() {
    const title = 'Delegación de voto en partido político o usuario';
    this.titleService.setTitle(title);
    this.metaTagService.updateTag({ name: 'description', content: title });
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
    this.findUsersForm = this.formBuilder.group({
      username: ['', [Validators.required]]
    });
    if (this.currentUser && this.currentUser.token) {
      this.delegatedParty();
      this.delegatedUser();
    } else {
    }
  }

  // convenience getter for easy access to form fields
  get f() { return this.findUsersForm.controls; }

  delegatedParty(): void {
    this.foundUsers = [];
    this.userService.delegatedParty()
      .subscribe(
        (data: any) => {
          if (data) {
            this.delegatedPartyValue = data;
            console.log(data);
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
    this.foundUsers = [];
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

  delegateParty(party: string): void {
    this.foundUsers = [];
    this.userService.delegateParty(party)
      .subscribe(
        (data: any) => {
          console.log('delegated party to ' + party);
          this.delegatedParty();
        },
        err => this.modalService.open('login')
      );
  }

  findUsers() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.findUsersForm.invalid) {
      return;
    }

    this.userService.findUser(this.f.username.value)
      .subscribe(
        data => {
          this.foundUsers = data;
        },
        error => {
          this.submitted = false;
        });
    }

  delegateUser(): void {
    this.userService.delegateUser(this.tentativeUser)
      .subscribe(
        (data: any) => {
          this.tentativeUser = undefined;
          this.delegatedUser();
          },
        err => {
        }
      );
  }

  removeDelegations(): void {
    this.delegation = 'none';
    this.tentativeUser = '';
    this.submitted = false;
    this.findUsersForm.setValue({'username': ''});
    this.findUsersForm.reset();
    this.foundUsers = [];
    this.delegatedUserValue = undefined;
    console.log('removing degation');
    this.delegateParty('nd');
  }

  setTentativeUser(username: string): void {
    this.foundUsers = [];
    this.submitted = false;
    this.tentativeUser = username;
    this.findUsersForm.setValue({'username': username});
  }

  get lf() { return this.loginForm.controls; }

  placeholder() {
    if (this.delegatedUserValue) {
      return this.delegatedUserValue.username;
    } else {
      return 'Buscar usuario (al menos 4 caracteres)';
    }
  }

  reset(): void {
    this.delegation = 'none';
    this.tentativeUser = '';
    this.submitted = false;
    this.findUsersForm.setValue({'username': ''});
    this.findUsersForm.reset();
    this.foundUsers = [];
    this.delegatedUser();
  }

  onLogin() {
    this.submitted = true;

    if (this.loginForm.invalid) {
      return;
    }

    this.authenticationService.login(this.lf.username.value, this.lf.password.value)
      .pipe(first())
      .subscribe(
        data => {
          this.findUsersForm.reset();
          this.submitted = false;
        },
        error => {
          this.submitted = false;
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
