import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GdprComponent } from './gdpr.component';

const routes: Routes = [{ path: '', component: GdprComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GdprRoutingModule { }
