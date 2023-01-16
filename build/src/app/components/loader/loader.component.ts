import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { IsLoadingService } from 'src/app/services/is-loading.service';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.css'],
})
export class LoaderComponent {
  isLoading!: Observable<boolean>;

  constructor(private isLoadingService: IsLoadingService) {
    this.isLoading = this.isLoadingService.isLoading;
  }
}
