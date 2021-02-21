import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ReactiveFormsModule} from '@angular/forms';

import { LawDetailRoutingModule } from './law-detail-routing.module';
import { LawDetailComponent } from './law-detail.component';


@NgModule({
  declarations: [LawDetailComponent],
  imports: [
    CommonModule,
    LawDetailRoutingModule,
    ReactiveFormsModule
  ]
})
export class LawDetailModule { }
