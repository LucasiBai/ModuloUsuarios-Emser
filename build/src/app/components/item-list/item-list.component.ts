import { Component, Input } from '@angular/core';

import { APIRequestsService } from 'src/app/services/api-requests.service';

import { ItemListContainerComponent } from '../../containers/item-list-container/item-list-container.component';

@Component({
  selector: 'app-item-list',
  templateUrl: './item-list.component.html',
  styleUrls: ['./item-list.component.css'],
})
export class ItemListComponent {
  @Input() item_list!: any[];
  @Input() fields!: any[];

  isCurrentUserError: Boolean = false;

  askingForDelete: any = { title: '', id: 0 };

  editFields: Boolean = false;
  editFieldsOff = {};

  constructor(
    private apiRequest: APIRequestsService,
    private itemListContainer: ItemListContainerComponent
  ) {}

  // Change is_active status

  public updateStatus(id: Number, status: Boolean) {
    const newStatus = status ? false : true;

    this.changeStatusApi(id, newStatus);
    if (!this.isCurrentUserError) {
      this.changeStatusLocal(id, newStatus);
    }
  }

  // Change Status
  public changeStatusLocal(id: any, newStatus: Boolean): any {
    this.item_list = this.item_list.map((item) => {
      if (item.id === id) {
        const updatedItem = { ...item };
        updatedItem.is_active = newStatus;
        return updatedItem;
      } else {
        return item;
      }
    });
  }

  public changeStatusApi(id: any, newStatus: Boolean): any {
    const isCurrentUser = this.apiRequest.isCurrentUser(id);
    if (!isCurrentUser) {
      this.isCurrentUserError = false;
      this.apiRequest
        .updateValue(`users/accounts/${id}/`, { is_active: newStatus })
        .subscribe();
    } else {
      this.isCurrentUserError = true;
    }
  }

  // Delete Item

  public askForDelete(item: any) {
    this.askingForDelete['asking'] = true;
    this.askingForDelete['title'] = item.username;
    this.askingForDelete['id'] = item.id;
  }

  public deleteRow(id: Number) {
    this.apiRequest.delete(`users/accounts/${id}/`).subscribe((res) => {
      this.itemListContainer.chargeData();
    });
  }

  public cancelDeleteAsk() {
    this.askingForDelete['title'] = '';
    this.askingForDelete['id'] = 0;
  }

  // Edit fields
  public showFieldEditor(item: any) {
    this.editFieldsOff = item;
  }

  public closeFieldEditor() {
    this.editFields = false;
    this.editFieldsOff = {};
  }

  public updateLocalData(id: Number, newData: any) {
    this.item_list = this.item_list.map((item) => {
      if (item.id === id) {
        const updateItem = { ...item };
        for (let key in newData) {
          updateItem[key] = newData[key];
        }
        return updateItem;
      } else {
        return item;
      }
    });
  }
}
