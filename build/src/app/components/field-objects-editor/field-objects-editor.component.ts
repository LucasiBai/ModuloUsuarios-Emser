import { Component, Input } from '@angular/core';

import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ItemListContainerComponent } from 'src/app/containers/item-list-container/item-list-container.component';
import { APIRequestsService } from 'src/app/services/api-requests.service';
import { FactoryFieldsService } from 'src/app/services/factory-fields.service';
import { ItemListComponent } from '../item-list/item-list.component';

@Component({
  selector: 'app-field-objects-editor',
  templateUrl: './field-objects-editor.component.html',
  styleUrls: ['./field-objects-editor.component.css'],
})
export class FieldObjectsEditorComponent {
  @Input() item!: any;
  @Input() fields!: any[];

  @Input() title!: string;

  editFieldForm!: FormGroup;

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

      if (this.title === 'User') {
        if (newValues.user_type == 'superuser') {
          newValues.is_superuser = true;
        } else if (newValues.user_type == 'admin') {
          newValues.is_superuser = false;
        }

        this.apiRequest
          .updateValue(`users/accounts/${this.item.id}/`, newValues)
          .subscribe((res) => {
            this.itemList.updateLocalData(this.item.id, newValues);
            this.itemList.closeFieldEditor();
          });
      } else {
        const url = this.factoryFields.getUrl(this.itemListContainer.category);
        this.apiRequest
          .updateValue(`${url}${this.item.id}/`, newValues)
          .subscribe((res) => {
            this.itemList.updateLocalData(this.item.id, newValues);
            this.itemList.closeFieldEditor();
          });
      }
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
      const validationField = [this.item[root.field], [Validators.required]];

      if (root.field === 'password' || root.field === 'repeatPassword') {
        validationField[1].push(Validators.minLength(5));
      } else {
        validationField[1].push(Validators.minLength(3));
      }

      if (root.field === 'email') {
        validationField[1].push(Validators.email);
      }

      validationFields[root.field] = validationField;
    }

    return this.fb.group(validationFields);
  }
}
