import { Component, Input } from '@angular/core';

import { APIRequestsService } from 'src/app/services/api-requests.service';
import { AuthService } from 'src/app/services/auth.service';
import { FactoryFieldsService } from 'src/app/services/factory-fields.service';

import { ItemListContainerComponent } from '../../containers/item-list-container/item-list-container.component';

@Component({
  selector: 'app-item-list',
  templateUrl: './item-list.component.html',
  styleUrls: ['./item-list.component.css'],
})
export class ItemListComponent {
  @Input() item_list!: any[];
  @Input() fields!: any[];
  @Input() createFields!: any[];

  @Input() isActiveField!: Boolean;
  @Input() settingsField!: Boolean;

  @Input() title!: string;

  @Input() darkMode!: boolean;

  isCurrentUserError: Boolean = false;
  _isNotSuperUserError: Boolean = false;

  isSuperuser: Boolean =
    this.authService.getUserPermises() === 'superuser' ? true : false;

  askingForDelete: any = { title: '', id: 0 };

  editFields: Boolean = false;
  editFieldsOff = {};

  constructor(
    private apiRequest: APIRequestsService,
    private factoryField: FactoryFieldsService,
    private itemListContainer: ItemListContainerComponent,
    private authService: AuthService
  ) {}

  public isNotSuperUserError() {
    this._isNotSuperUserError = true;
    setTimeout(() => {
      this._isNotSuperUserError = false;
    }, 5000);
  }

  // Change is_active status

  public updateStatus(id: Number, status: Boolean) {
    if (this.isSuperuser) {
      const newStatus = status ? false : true;

      this.changeStatusApi(id, newStatus);
      if (!this.isCurrentUserError) {
        this.changeStatusLocal(id, newStatus);
      }
    } else {
      this.isNotSuperUserError();
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
    const category = this.itemListContainer.category;
    if (!isCurrentUser || category !== 'users') {
      const url = this.factoryField.getUrl(this.itemListContainer.category);
      this.isCurrentUserError = false;
      this.apiRequest
        .updateValue(`${url}${id}/`, { is_active: newStatus })
        .subscribe();
    } else {
      this.isCurrentUserError = true;
    }
  }

  // Delete Item

  public askForDelete(item: any) {
    this.askingForDelete['title'] = item.username || item.name || item.project;
    this.askingForDelete['id'] = item.id;
  }

  public deleteRow(id: Number) {
    if (this.isSuperuser) {
      const url = this.factoryField.getUrl(this.itemListContainer.category);
      this.apiRequest.delete(`${url}${id}/`).subscribe((res) => {
        this.itemListContainer.chargeData();
      });
    } else {
      this.isNotSuperUserError();
    }
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
