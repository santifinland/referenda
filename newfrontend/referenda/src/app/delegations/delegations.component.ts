import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

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

  delegation: string = "none";
  delegatedPartyValue: Party;
  delegatedUserValue: User;

  findUsersForm: FormGroup;
  submitted = false;
  foundUsers: User[];

  constructor(
      private authenticationService: AuthenticationService,
      private formBuilder: FormBuilder,
      private modalService: ModalService,
      private userService: UserService) {
    this.currentUserSubscription = this.authenticationService.currentUser.subscribe(user => {
      this.currentUser = user;
      this.delegatedParty();
      this.delegatedUser();
    });
  }

  ngOnInit() {
    this.findUsersForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.minLength(4)]]
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
    this.userService.delegatedParty()
      .subscribe(
        (data: any) => {
          if (data) {
            this.delegatedPartyValue = data;
            this.delegation = "party";
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
            this.delegation = "user";
          }
        },
        err => {}
      );
  }

  delegateParty(party: string): void {
    this.userService.delegateParty(party)
      .subscribe(
        (data: any) => { this.delegatedParty(); },
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
          this.modalService.open('login');
        });
    }

  delegateUser(username: string): void {
    this.userService.delegateUser(username)
      .subscribe(
        (data: any) => { this.delegatedUser(); },
        err => this.modalService.open('login')
      );
   }
}
