import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AboutusComponent } from './aboutus/aboutus.component';
import { CookiesComponent } from './cookies/cookies.component';
import { DelegationsComponent } from './delegations/delegations.component';
import { DevelopersComponent } from './developers/developers.component';
import { GdprComponent } from './gdpr/gdpr.component';
import { LawDetailComponent } from './law-detail/law-detail.component';
import { LawsComponent } from './laws/laws.component';
import { LoginComponent } from './login';
import { PasswordComponent } from './password/password.component';
import { RegisterComponent } from './register';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { ResultsComponent } from './results/results.component';
import { StatsComponent } from './stats/stats.component';

const routes: Routes = [
  { path: '', component: LawsComponent },
  { path: 'aboutus', component: AboutusComponent },
  { path: 'cookies', component: CookiesComponent },
  { path: 'delegar', component: DelegationsComponent },
  { path: 'developers', component: DevelopersComponent },
  { path: 'estadisticas', component: StatsComponent },
  { path: 'gdpr', component: GdprComponent },
  { path: 'leyes', component: LawsComponent },
  { path: 'ley/:slug', component: LawDetailComponent },
  { path: 'login', component: LoginComponent },
  { path: 'password', component: PasswordComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'reset-password', component: ResetPasswordComponent },
  { path: 'resultados', component: ResultsComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
