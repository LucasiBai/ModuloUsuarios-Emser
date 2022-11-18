import { Component, Input } from '@angular/core';

import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { APIRequestsService } from 'src/app/services/api-requests.service';
import { ItemListComponent } from '../item-list/item-list.component';

@Component({
  selector: 'app-field-editor',
  templateUrl: './field-editor.component.html',
  styleUrls: ['./field-editor.component.css'],
})
export class FieldEditorComponent {
  @Input() item!: any;
  @Input() fields!: any[];

  @Input() title!: string;

  editFieldForm!: FormGroup;

  constructor(
    private readonly fb: FormBuilder,
    private apiRequest: APIRequestsService,
    private itemList: ItemListComponent
  ) {}

  ngOnChanges(): void {
    this.editFieldForm = this.initForm();
  }

  public updateData() {
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
