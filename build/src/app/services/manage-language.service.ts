import { Injectable } from '@angular/core';

import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root',
})
export class ManageLanguageService {
  private _selectedLanguage!: string;

  constructor(private translate: TranslateService) {}

  getCurrentLanguage() {
    const selectedLanguage = window.localStorage.getItem('language') || 'en';
    if (selectedLanguage === 'es') {
      this._selectedLanguage = 'es';
      this.translate.use('es');
      return 'es';
    }
    this._selectedLanguage = 'en';
    this.translate.use('en');
    return 'en';
  }

  setSelectedLanguage(language: string) {
    window.localStorage.setItem('language', language);
    this.translate.use(language);
  }
}
