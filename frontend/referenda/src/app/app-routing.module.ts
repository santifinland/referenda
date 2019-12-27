import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DelegationsComponent } from './delegations/delegations.component';
import { HomeComponent } from './home/home.component';
import { LawDetailComponent } from './law-detail/law-detail.component';
import { LawsComponent } from './laws/laws.component';
import { LoginComponent } from './login';
import { PasswordComponent } from './password/password.component';
import { ProfileComponent } from './profile/profile.component';
import { RegisterComponent } from './register';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { ResultsComponent } from './results/results.component';

const routes: Routes = [
  { path: '', component: LawsComponent },
  { path: 'aboutus',loadChildren: () => import('./aboutus/aboutus.module').then(m => m.AboutusComponent) },
  { path: 'cookies',loadChildren: () => import('./cookies/cookies.module').then(m => m.CookiesComponent) },
  { path: 'delegar', component: DelegationsComponent },
  { path: 'developers', loadChildren: () => import('./developers/developers.module').then(m => m.DevelopersModule) },
  { path: 'estadisticas',loadChildren: () => import('./stats/stats.module').then(m => m.StatsModule) },
  { path: 'gdpr',loadChildren: () => import('./gdpr/gdpr.module').then(m => m.GdprComponent) },
  { path: 'home', component: HomeComponent },
  { path: 'leyes', component: LawsComponent },
  { path: 'ley/:slug', component: LawDetailComponent },
  { path: 'login', component: LoginComponent },
  { path: 'password', component: PasswordComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'reset-password', component: ResetPasswordComponent },
  { path: 'resultados', component: ResultsComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
