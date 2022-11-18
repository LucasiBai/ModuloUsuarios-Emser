import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { APIRequestsService } from 'src/app/services/api-requests.service';
import { FactoryFieldsService } from 'src/app/services/factory-fields.service';

@Component({
  selector: 'app-item-list-container',
  templateUrl: './item-list-container.component.html',
  styleUrls: ['./item-list-container.component.css'],
})
export class ItemListContainerComponent {
  category!: string;
  title: string = 'User';

  item_list!: any[];
  fields: any[] = [
    { field: 'id', as: 'Id', type: null },
    { field: 'username', as: 'Username', type: 'text' },
    { field: 'first_name', as: 'First Name', type: 'text' },
    { field: 'last_name', as: 'Last Name', type: 'text' },
    { field: 'user_type', as: 'Type', type: 'radio' },
  ];

  createFields: any[] = [
    { field: 'email', as: 'Email', type: 'email' },
    { field: 'username', as: 'Username', type: 'text' },
    { field: 'password', as: 'Password', type: 'password' },
    { field: 'repeatPassword', as: 'Repeat Password', type: 'password' },
    { field: 'first_name', as: 'First Name', type: 'text' },
    { field: 'last_name', as: 'Last Name', type: 'text' },
    { field: 'user_type', as: 'Type', type: 'radio' },
  ];

  constructor(
    private apiRequest: APIRequestsService,
    private factoryFieldsService: FactoryFieldsService,
    private readonly route: ActivatedRoute
  ) {
    this.chargeData();
  }

  ngOnChange() {
    this.chargeData();
  }

  public chargeData() {
    this.route.params.subscribe(({ category }) => (this.category = category));
    if (!this.category || this.category === 'users') {
      this.apiRequest.get('users/accounts/').subscribe((res: any) => {
        this.item_list = res.sort((a: any, b: any) => a.id - b.id);
      });
    } else {
      this.fields = this.factoryFieldsService.getFields(this.category);
      this.createFields = this.factoryFieldsService.getCreateFields(
        this.category
      );
      this.title = this.factoryFieldsService.getTitle(this.category);

      const url: string = this.factoryFieldsService.getUrl(this.category);

      this.apiRequest.get(url).subscribe((res: any) => {
        this.item_list = res.sort((a: any, b: any) => a.id - b.id);
        console.log(res);
      });
    }
  }
}
