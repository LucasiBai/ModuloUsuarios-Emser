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
    { field: 'id' },
    { field: 'username' },
    { field: 'first_name' },
    { field: 'last_name' },
    { field: 'user_type' },
    { field: 'is_active' },
  ];

  constructor(private apiRequest: APIRequestsService) {
    this.chargeData();
  }
  public chargeData() {
    this.apiRequest.get('users/accounts/').subscribe((res: any) => {
      this.item_list = res.sort((a: any, b: any) => a.id - b.id);
    });
  }
}
