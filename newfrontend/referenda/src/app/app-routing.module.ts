import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AboutusComponent } from './aboutus/aboutus.component';
import { AuthGuard } from './_guards';
import { CookiesComponent } from './cookies/cookies.component';
import { DelegationsComponent } from './delegations/delegations.component';
import { DevelopersComponent } from './developers/developers.component';
import { GdprComponent } from './gdpr/gdpr.component';
import { HomeComponent } from './home';
import { LawDetailComponent } from './law-detail/law-detail.component';
import { LawsComponent } from './laws/laws.component';
import { LoginComponent } from './login';
import { RegisterComponent } from './register';
import { ResultsComponent } from './results/results.component';
import { StatsComponent } from './stats/stats.component';

const routes: Routes = [
  { path: '', component: LawsComponent },
  { path: 'aboutus', component: AboutusComponent },
  { path: 'cookies', component: CookiesComponent },
  { path: 'delegate', component: DelegationsComponent },
  { path: 'developers', component: DevelopersComponent },
  { path: 'gdpr', component: GdprComponent },
  { path: 'laws', component: LawsComponent },
  { path: 'law/:slug', component: LawDetailComponent },
  { path: 'results', component: ResultsComponent },
  { path: 'stats', component: StatsComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
