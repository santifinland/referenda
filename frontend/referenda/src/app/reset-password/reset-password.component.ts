import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { AlertService, UserService } from '../_services';


@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {

  passwordForm: FormGroup;
  submitted = false;
  token: string;

  constructor(
      private alertService: AlertService,
      private formBuilder: FormBuilder,
      private route: ActivatedRoute,
      private router: Router,
      private userService: UserService,
  ) {
    this.route.queryParams.subscribe(params => {
      this.token = params['token'];
    });
  }

  ngOnInit() {
    this.passwordForm = this.formBuilder.group({
      token: [this.token, [Validators.required, Validators.minLength(6)]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  get pf() { return this.passwordForm.controls; }

  onSetPassword() {
    this.submitted = true;

    if (this.passwordForm.invalid) {
      return;
    }

    this.userService.setPassword(this.passwordForm.value)
      .pipe(first())
      .subscribe(
        data => {
          this.alertService.success('Nueva contraseña guardada.', true);
          this.router.navigate(['/login']);
        },
        error => {
          this.alertService.error(error);
        });
  }
}
