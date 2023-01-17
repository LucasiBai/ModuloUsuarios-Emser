import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DarkModeService {
  constructor() {}

  private _isInDarkMode$: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);

  get darkModeStatus() {
    const onDarkMode = window.localStorage.getItem('darkMode') || false;

    this.setDarkModeStatus = Boolean(onDarkMode == 'true');

    return this._isInDarkMode$.asObservable();
  }

  set setDarkModeStatus(status: boolean) {
    window.localStorage.setItem('darkMode', String(status));
    this._isInDarkMode$.next(status);
  }
}
