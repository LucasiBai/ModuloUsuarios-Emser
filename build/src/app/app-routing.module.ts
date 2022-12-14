import { Component, NgModule } from '@angular/core';

import { RouterModule, Routes } from '@angular/router';
import { ResetPasswordValidateComponent } from './components/reset-password-validate/reset-password-validate.component';

import { ItemListContainerComponent } from './containers/item-list-container/item-list-container.component';
import { LoginContainerComponent } from './containers/login-container/login-container.component';
import { NotFoundPageComponent } from './containers/not-found-page/not-found-page.component';
import { ResetPasswordContainerComponent } from './containers/reset-password-container/reset-password-container.component';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/home' },
  {
    path: 'login',
    component: LoginContainerComponent,
    canActivate: [],
  },
  {
    path: 'home',
    component: ItemListContainerComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'tables/:category',
    component: ItemListContainerComponent,
    canActivate: [AuthGuard],
  },
  { path: 'reset-password', component: ResetPasswordContainerComponent },
  {
    path: 'reset-password/:encodedPk/:token',
    component: ResetPasswordValidateComponent,
  },
  {
    path: '**',
    pathMatch: 'full',
    component: NotFoundPageComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
