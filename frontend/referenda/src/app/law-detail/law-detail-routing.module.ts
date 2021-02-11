import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import {LawDetailComponent} from './law-detail.component';

const routes: Routes = [{ path: '', component: LawDetailComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LawDetailRoutingModule { }
