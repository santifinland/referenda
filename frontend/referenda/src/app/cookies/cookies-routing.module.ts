import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CookiesComponent } from './cookies.component';

const routes: Routes = [{ path: '', component: CookiesComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CookiesRoutingModule { }
