import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class IsLoadingService {
  private isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );

  constructor() {}

  get isLoading(): Observable<boolean> {
    return this.isLoading$.asObservable();
  }

  private set setIsLoading(bool: boolean) {
    this.isLoading$.next(bool);
  }

  showLoader(): void {
    this.setIsLoading = true;
  }

  hideLoader(): void {
    this.setIsLoading = false;
  }
}
