import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';

import { TranslateService } from '@ngx-translate/core';
import { APIRequestsService } from 'src/app/services/api-requests.service';
import { DarkModeService } from 'src/app/services/dark-mode.service';
import { FactoryFieldsService } from 'src/app/services/factory-fields.service';

@Component({
  selector: 'app-item-list-container',
  templateUrl: './item-list-container.component.html',
  styleUrls: ['./item-list-container.component.css'],
})
export class ItemListContainerComponent {
  category!: string;
  title: string = 'User';

  isDarkMode: boolean = this.darkMode.getDarkModeStatus();

  item_list!: any[];
  fields!: any[];

  createFields!: any[];

  constructor(
    private apiRequest: APIRequestsService,
    private factoryFieldsService: FactoryFieldsService,
    private readonly route: ActivatedRoute,
    private darkMode: DarkModeService,
    private metaService: Meta,
    private titleService: Title,
    private translate: TranslateService
  ) {
    this.chargeData();
  }

  ngOnChange() {}

  ngOnInit() {
    const title = this.translate.instant('User Module');
    const subtitle = this.translate.instant(this.title);

    this.metaService.addTags([
      { name: 'description', content: 'Módulos de usuario tabla home' },
      { name: 'author', content: 'LucasiBai' },
      {
        name: 'keywords',
        content: 'home, usuarios, tablas, módulo, proyectos',
      },
    ]);
    this.titleService.setTitle(`${title} | ${subtitle}`);
  }

  public searchData(table: string) {
    this.fields = this.factoryFieldsService.getFields(table);
    this.createFields = this.factoryFieldsService.getCreateFields(table);
    this.title = this.factoryFieldsService.getTitle(table);

    const url: string = this.factoryFieldsService.getUrl(table);

    this.apiRequest.get(url).subscribe((res: any) => {
      if (!res) {
        this.item_list = [];
      } else {
        this.item_list = res.sort((a: any, b: any) => a.id - b.id);
      }
    });
  }

  public chargeData() {
    this.route.params.subscribe(({ category }) => (this.category = category));
    if (!this.category) {
      this.searchData('users');
    } else {
      this.searchData(this.category);
    }
  }
}
