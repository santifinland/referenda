import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {CreditsRoutingModule} from './credtis-routing.module';
import {CreditsComponent} from './credits.component';


@NgModule({
  declarations: [CreditsComponent],
  imports: [
    CommonModule,
    CreditsRoutingModule
  ]
})
export class CreditsModule { }
