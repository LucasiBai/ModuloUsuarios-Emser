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

  public closeEditor() {
    this.itemList.closeFieldEditor();
  }

  initForm(): FormGroup {
    return this.fb.group({
      username: [
        this.item?.username,
        [Validators.required, Validators.minLength(3)],
      ],
      first_name: [
        this.item?.first_name,
        [Validators.required, Validators.minLength(3)],
      ],
      last_name: [
        this.item?.last_name,
        [Validators.required, Validators.minLength(3)],
      ],
      user_type: [this.item?.user_type, [Validators.required]],
    });
  }
}
