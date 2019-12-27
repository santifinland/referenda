import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AboutusComponent } from './aboutus/aboutus.component';
import { CookiesComponent } from './cookies/cookies.component';
import { DelegationsComponent } from './delegations/delegations.component';
import { GdprComponent } from './gdpr/gdpr.component';
import { HomeComponent } from './home/home.component';
import { LawDetailComponent } from './law-detail/law-detail.component';
import { LawsComponent } from './laws/laws.component';
import { LoginComponent } from './login';
import { PasswordComponent } from './password/password.component';
import { ProfileComponent } from './profile/profile.component';
import { RegisterComponent } from './register';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { ResultsComponent } from './results/results.component';
import { StatsComponent } from './stats/stats.component';

const routes: Routes = [
  { path: '', component: LawsComponent },
  { path: 'aboutus', component: AboutusComponent },
  { path: 'cookies', component: CookiesComponent },
  { path: 'delegar', component: DelegationsComponent },
  { path: 'developers',
    loadChildren: () => import('./developers/developers.module').then(mod => mod.DevelopersModule)},
  { path: 'estadisticas', component: StatsComponent },
  { path: 'gdpr', component: GdprComponent },
  { path: 'home', component: HomeComponent },
  { path: 'leyes', component: LawsComponent },
  { path: 'ley/:slug', component: LawDetailComponent },
  { path: 'login', component: LoginComponent },
  { path: 'password', component: PasswordComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'reset-password', component: ResetPasswordComponent },
  { path: 'resultados', component: ResultsComponent },
  { path: 'developers', loadChildren: () => import('./developers/developers.module').then(m => m.DevelopersModule) },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
