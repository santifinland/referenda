import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdminLawComponent } from './admin-law/admin-law.component';
import { CreateLawComponent } from './create-law/create-law.component';
import { DelegationsComponent } from './delegations/delegations.component';
import { HomeComponent } from './home/home.component';
import { LawDetailComponent } from './law-detail/law-detail.component';
import { LawsComponent } from './laws/laws.component';
import { LoginComponent } from './login';
import { PartiesComponent } from './parties/parties.component';
import { PasswordComponent } from './password/password.component';
import { ProfileComponent } from './profile/profile.component';
import { RegisterComponent } from './register';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { ResultsComponent } from './results/results.component';


const routes: Routes = [
  { path: '', component: LawsComponent },
  { path: 'aboutus', loadChildren: () => import('./aboutus/aboutus.module').then(m => m.AboutusModule) },
  { path: 'admin-law', component: CreateLawComponent },
  { path: 'admin-law/:slug', component: AdminLawComponent },
  { path: 'cookies', loadChildren: () => import('./cookies/cookies.module').then(m => m.CookiesModule) },
  { path: 'delegar', component: DelegationsComponent },
  { path: 'developers', loadChildren: () => import('./developers/developers.module').then(m => m.DevelopersModule) },
  { path: 'estadisticas', loadChildren: () => import('./stats/stats.module').then(m => m.StatsModule) },
  { path: 'gdpr', loadChildren: () => import('./gdpr/gdpr.module').then(m => m.GdprModule) },
  { path: 'home', component: HomeComponent },
  { path: 'leyes', component: LawsComponent },
  { path: 'ley/:slug', component: LawDetailComponent },
  { path: 'login', component: LoginComponent },
  { path: 'partidos', component: PartiesComponent },
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
