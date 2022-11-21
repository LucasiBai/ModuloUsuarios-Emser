import { Component, Input, OnChanges } from '@angular/core';

import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ItemListContainerComponent } from 'src/app/containers/item-list-container/item-list-container.component';
import { APIRequestsService } from 'src/app/services/api-requests.service';
import { FactoryFieldsService } from 'src/app/services/factory-fields.service';
import { ItemListComponent } from '../item-list/item-list.component';

@Component({
  selector: 'app-field-editor',
  templateUrl: './field-editor.component.html',
  styleUrls: ['./field-editor.component.css'],
})
export class FieldEditorComponent implements OnChanges {
  @Input() item!: any;
  @Input() fields!: any[];

  @Input() title!: string;

  editFieldForm!: FormGroup;

  inputError!: boolean;
  inputErrorMsg: string = '';

  successfulSended!: boolean;

  foreign_keys!: any;

  constructor(
    private readonly fb: FormBuilder,
    private apiRequest: APIRequestsService,
    private factoryFields: FactoryFieldsService,
    private itemList: ItemListComponent,
    private itemListContainer: ItemListContainerComponent
  ) {}

  ngOnChanges(): void {
    this.editFieldForm = this.initForm();
  }

  public updateData() {
    if (this.itemList.isSuperuser) {
      const newValues = { ...this.editFieldForm.value };
      let url;

      if (this.title === 'Users') {
        if (newValues.user_type == 'superuser') {
          newValues.is_superuser = true;
        } else if (newValues.user_type == 'admin') {
          newValues.is_superuser = false;
        }

        url = 'users/accounts/';
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

      this.apiRequest
        .updateValue(`${url}${this.item.id}/`, newValues)
        .subscribe(
          (res) => {
            this.itemListContainer.chargeData();
            this.itemList.closeFieldEditor();
            this.successfulSended = true;
            this.inputError = false;
          },
          (error) => {
            this.inputError = true;
            for (let msg in error.error) {
              this.inputErrorMsg += error.error[msg];
            }
          }
        );
    } else {
      this.itemList.isNotSuperUserError();
    }
  }

  public closeEditor() {
    this.itemList.closeFieldEditor();
  }

  initForm(): FormGroup {
    const validationFields: any = {};

    for (let root of this.fields) {
      let validationField;

      // Object validation
      if (!root.child) {
        validationField = [this.item[root.field], [Validators.required]];
      } else {
        validationField = [
          this.item[root.field] ? this.item[root.field]['id'] : '',
          [Validators.required],
        ];
      }

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
