import { NgModule } from '@angular/core';

import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from './guards/auth.guard';

import { HomeContainerComponent } from './containers/home-container/home-container.component';
import { LoginContainerComponent } from './containers/login-container/login-container.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/login' },
  {
    path: 'login',
    component: LoginContainerComponent,
    canActivate: [AuthGuard],
  },
  { path: 'home', component: HomeContainerComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
