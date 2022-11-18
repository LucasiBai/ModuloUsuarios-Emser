import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css'],
})
export class NavBarComponent {
  user: any = this.authService.getUserData();

  constructor(private authService: AuthService, private router: Router) {}
  public logout() {
    this.authService.logout();
    this.router.navigateByUrl('/login');
  }
}
