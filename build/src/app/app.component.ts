import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'build';
  constructor(public translate: TranslateService) {
    this.translate.addLangs(['es', 'en']);
    this.translate.setDefaultLang('en');
  }
}
