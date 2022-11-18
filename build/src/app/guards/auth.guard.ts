import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';

import { CookieService } from 'ngx-cookie-service';
import { AuthService } from '../services/auth.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(
    private cookieService: CookieService,
    private router: Router,
    private authService: AuthService
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    const cookie = this.cookieService.check('token');
    const expiration = Number(this.cookieService.get('token-expiration'));
    const refreshExpiration = Number(
      this.cookieService.get('refresh-expiration')
    );

    if (!cookie || refreshExpiration < Date.now()) {
      this.router.navigateByUrl('/login');
      return false;
    } else if (expiration > Date.now()) {
      return true;
    } else {
      this.authService.refreshToken().subscribe();
      window.location.reload();
      return true;
    }
  }
}
