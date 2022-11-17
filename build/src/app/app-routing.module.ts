import { NgModule } from '@angular/core';

import { RouterModule, Routes } from '@angular/router';

import { HomeContainerComponent } from './containers/home-container/home-container.component';
import { LoginContainerComponent } from './containers/login-container/login-container.component';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/login' },
  {
    path: 'login',
    component: LoginContainerComponent,
    canActivate: [],
  },
  {
    path: 'home',
    component: HomeContainerComponent,
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
