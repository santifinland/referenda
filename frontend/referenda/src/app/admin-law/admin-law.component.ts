import {Component, OnInit, ViewChild} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

import { AuthenticationService } from '../_services';
import { User } from '../_models';


@Component({
  selector: 'app-delegations',
  templateUrl: './admin-law.component.html',
  styleUrls: ['./admin-law.component.css']
})
export class AdminLawComponent implements OnInit {

  currentUser: User;
  currentUserSubscription: Subscription;

  constructor(
      private authenticationService: AuthenticationService,
      private formBuilder: FormBuilder) {
    this.currentUserSubscription = this.authenticationService.currentUser.subscribe(user => {
      this.currentUser = user;
    });
  }

  ngOnInit() {
  }
}
