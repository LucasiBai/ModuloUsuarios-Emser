import { Component } from '@angular/core';

import { APIRequestsService } from 'src/app/services/api-requests.service';

@Component({
  selector: 'app-item-list-container',
  templateUrl: './item-list-container.component.html',
  styleUrls: ['./item-list-container.component.css'],
})
export class ItemListContainerComponent {
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

  constructor(private apiRequest: APIRequestsService) {
    this.chargeData();
  }

  ngOnChange() {}

  public chargeData() {
    this.apiRequest.get('users/accounts/').subscribe((res: any) => {
      this.item_list = res.sort((a: any, b: any) => a.id - b.id);
    });
  }
}
