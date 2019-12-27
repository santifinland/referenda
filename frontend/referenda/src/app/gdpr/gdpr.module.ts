import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GdprRoutingModule } from './gdpr-routing.module';
import { GdprComponent } from './gdpr.component';


@NgModule({
  declarations: [GdprComponent],
  imports: [
    CommonModule,
    GdprRoutingModule
  ]
})
export class GdprModule { }
