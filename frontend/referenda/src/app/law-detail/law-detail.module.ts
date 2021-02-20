import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LawDetailRoutingModule } from './law-detail-routing.module';
import { LawDetailComponent } from './law-detail.component';


@NgModule({
  declarations: [LawDetailComponent],
  imports: [
    CommonModule,
    LawDetailRoutingModule
  ]
})
export class LawDetailModule { }
