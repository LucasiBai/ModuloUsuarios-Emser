import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DarkModeService {
  constructor() {}

  private _isInDarkMode!: boolean;

  getDarkModeStatus() {
    const onDarkMode = window.localStorage.getItem('darkMode') || false;
    if (onDarkMode === 'true') {
      this._isInDarkMode = true;
      return true;
    } else {
      this._isInDarkMode = false;
      return false;
    }
  }

  setOnDarkMode(e: any) {
    window.localStorage.setItem('darkMode', e.target.checked);
  }
}
