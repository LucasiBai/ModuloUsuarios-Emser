import { Component, Input } from '@angular/core';

import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ItemListContainerComponent } from 'src/app/containers/item-list-container/item-list-container.component';
import { APIRequestsService } from 'src/app/services/api-requests.service';
import { FactoryFieldsService } from 'src/app/services/factory-fields.service';
import { ItemListComponent } from '../item-list/item-list.component';

@Component({
  selector: 'app-field-upload',
  templateUrl: './field-upload.component.html',
  styleUrls: ['./field-upload.component.css'],
})
export class FieldUploadComponent {
  @Input() title!: any;
  @Input() createFields!: any[];

  differentPasswordError!: Boolean;
  successfulSended!: Boolean;

  uploadFieldForm!: FormGroup;

  constructor(
    private readonly fb: FormBuilder,
    private apiRequest: APIRequestsService,
    private factoryFields: FactoryFieldsService,
    private itemListContainer: ItemListContainerComponent,
    private itemList: ItemListComponent
  ) {}

  ngOnChanges(): void {
    this.uploadFieldForm = this.initForm();
  }

  public uploadData() {
    if (this.itemList.isSuperuser) {
      const newValues = { ...this.uploadFieldForm.value };
      let url;

      if (this.title === 'Users') {
        if (newValues.user_type == 'superuser') {
          newValues.is_staff = true;
          newValues.is_superuser = true;
        } else if (newValues.user_type == 'admin') {
          newValues.is_staff = true;
          newValues.is_superuser = false;
        }

        if (newValues['password'] !== newValues['repeatPassword']) {
          this.differentPasswordError = true;
          return;
        } else {
          this.differentPasswordError = false;
          delete newValues['repeatPassword'];
        }

        url = `users/accounts/`;
      } else if (this.title === 'Projects Users') {
        for (let field in newValues) {
          if (field == 'username') {
            newValues.user_id = Number(newValues.username);
            delete newValues.username;
          } else {
            newValues.project_id = Number(newValues.name);
            delete newValues.name;
          }
        }
        url = this.factoryFields.getUrl(this.itemListContainer.category);
      } else {
        url = this.factoryFields.getUrl(this.itemListContainer.category);
      }
      // Api request
      this.apiRequest.post(url, newValues).subscribe((res) => {
        this.uploadFieldForm = this.initForm();
        this.itemListContainer.chargeData();
        this.successfulSended = true;
      });
    } else {
      this.itemList.isNotSuperUserError();
    }
  }

  initForm(): FormGroup {
    const validationFields: any = {};

    for (let root of this.createFields) {
      const validationField: any = ['', [Validators.required]];

      if (root.field === 'password' || root.field === 'repeatPassword') {
        validationField[1].push(Validators.minLength(5));
      } else {
        validationField[1].push(Validators.minLength(3));
      }

      if (root.field === 'email') {
        validationField[1].push(Validators.email);
      }

      // Object Validation
      if (!root.child) {
        validationFields[root.field] = validationField;
      } else {
        validationFields[root.childName] = validationField;
      }
    }

    return this.fb.group(validationFields);
  }
}
