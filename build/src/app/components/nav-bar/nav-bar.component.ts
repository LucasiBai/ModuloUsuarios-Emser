import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from 'src/app/services/auth.service';
import { DarkModeService } from 'src/app/services/dark-mode.service';
import { ManageLanguageService } from 'src/app/services/manage-language.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css'],
})
export class NavBarComponent implements OnInit {
  user: any = this.authService.getUserData();

  onDarkMode!: boolean;

  selectedLanguage: string = this.translate.getCurrentLanguage();

  constructor(
    private authService: AuthService,
    private router: Router,
    private darkMode: DarkModeService,
    private translate: ManageLanguageService
  ) {}

  ngOnInit() {
    this.darkMode.darkModeStatus.subscribe((res) => {
      this.onDarkMode = res;
    });
  }

  public logout() {
    this.authService.logout();
    this.router.navigateByUrl('/login');
  }

  public setDarkMode(e: any) {
    this.darkMode.setDarkModeStatus = e.target.checked;
  }

  public changeLanguage(e: any) {
    if (e.target.checked) {
      this.translate.setSelectedLanguage('es');
    } else {
      this.translate.setSelectedLanguage('en');
    }
  }
}
