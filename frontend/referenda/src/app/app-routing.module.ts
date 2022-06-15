import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdminLawComponent } from './admin-law/admin-law.component';
import { CreateLawComponent } from './create-law/create-law.component';
import { DelegationsComponent } from './delegations/delegations.component';
import { HomeComponent } from './home/home.component';
import { LawsComponent } from './laws/laws.component';
import { LoginComponent } from './login';
import { PartiesComponent } from './parties/parties.component';
import { PasswordComponent } from './password/password.component';
import { RegisterComponent } from './register';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { ResultsComponent } from './results/results.component';


const routes: Routes = [
  { path: '', component: LawsComponent },
  { path: 'admin-law', component: CreateLawComponent },
  { path: 'admin-law/:slug', component: AdminLawComponent },
  { path: 'cookies', loadChildren: () => import('./cookies/cookies.module').then(m => m.CookiesModule) },
  { path: 'creditos', loadChildren: () => import('./credits/credits.module').then(m => m.CreditsModule) },
  { path: 'delegar', component: DelegationsComponent },
  { path: 'developers', loadChildren: () => import('./developers/developers.module').then(m => m.DevelopersModule) },
  { path: 'estadisticas', loadChildren: () => import('./stats/stats.module').then(m => m.StatsModule) },
  { path: 'legal', loadChildren: () => import('./gdpr/gdpr.module').then(m => m.GdprModule) },
  { path: 'home', component: HomeComponent },
  { path: 'leyes', component: LawsComponent },
  { path: 'ley/:slug', loadChildren: () => import('./law-detail/law-detail.module').then(m => m.LawDetailModule) },
  { path: 'login', component: LoginComponent },
  { path: 'partidos', component: PartiesComponent },
  { path: 'password', component: PasswordComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'referenda', loadChildren: () => import('./aboutus/aboutus.module').then(m => m.AboutusModule) },
  { path: 'reset-password', component: ResetPasswordComponent },
  { path: 'resultados', component: ResultsComponent },
  { path: '**',  loadChildren: () => import('./not-found/not-found.module').then(m => m.NotFoundModule) }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    initialNavigation: 'enabled'
})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
