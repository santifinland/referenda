import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { AlertService, UserService } from '../_services';


@Component({
  selector: 'app-password',
  templateUrl: './password.component.html',
  styleUrls: ['./password.component.css']
})
export class PasswordComponent implements OnInit {

  passwordForm: FormGroup;
  submitted = false;

  constructor(
      private alertService: AlertService,
      private formBuilder: FormBuilder,
      private route: ActivatedRoute,
      private router: Router,
      private userService: UserService,
  ) {}

  ngOnInit() {
    this.passwordForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  get pf() { return this.passwordForm.controls; }

  onRemember() {
    this.submitted = true;

    if (this.passwordForm.invalid) {
      return;
    }

    this.userService.rememberPassword(this.passwordForm.value)
      .pipe(first())
      .subscribe(
        data => {
          this.alertService.success('Recordatorio enviado.', true);
          this.router.navigate(['/login']);
        },
        error => {
          this.alertService.error(error);
        });
  }
}
