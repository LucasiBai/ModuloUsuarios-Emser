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

  set setIsLoading(bool: boolean) {
    this.isLoading$.next(bool);
  }
}
