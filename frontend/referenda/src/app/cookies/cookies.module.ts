import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CookiesRoutingModule } from './cookies-routing.module';
import { CookiesComponent } from './cookies.component';


@NgModule({
  declarations: [CookiesComponent],
  imports: [
    CommonModule,
    CookiesRoutingModule
  ]
})
export class CookiesModule { }
