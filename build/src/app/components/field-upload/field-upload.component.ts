import { Component, Input } from '@angular/core';

import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ItemListContainerComponent } from 'src/app/containers/item-list-container/item-list-container.component';
import { APIRequestsService } from 'src/app/services/api-requests.service';
import { ItemListComponent } from '../item-list/item-list.component';

@Component({
  selector: 'app-field-upload',
  templateUrl: './field-upload.component.html',
  styleUrls: ['./field-upload.component.css'],
})
export class FieldUploadComponent {
  @Input() title!: any;

  differentPasswordError!: Boolean;

  uploadFieldForm!: FormGroup;

  constructor(
    private readonly fb: FormBuilder,
    private apiRequest: APIRequestsService,
    private itemListContainer: ItemListContainerComponent
  ) {}

  ngOnChanges(): void {
    this.uploadFieldForm = this.initForm();
  }

  public uploadData() {
    const newValues = { ...this.uploadFieldForm.value };

    if (newValues.user_type == 'superuser') {
      newValues.is_superuser = true;
    } else if (newValues.user_type == 'admin') {
      newValues.is_superuser = false;
    }

    if (newValues['password'] !== newValues['repeatPassword']) {
      this.differentPasswordError = true;
      return;
    } else {
      this.differentPasswordError = false;
      delete newValues['repeatPassword'];
    }

    this.apiRequest.post(`users/accounts/`, newValues).subscribe((res) => {
      this.itemListContainer.chargeData();
    });
  }

  initForm(): FormGroup {
    return this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: [
        '',
        [Validators.required, Validators.minLength(3), Validators.email],
      ],
      password: ['', [Validators.required, Validators.minLength(5)]],
      repeatPassword: ['', [Validators.required, Validators.minLength(5)]],
      first_name: ['', [Validators.required, Validators.minLength(3)]],
      last_name: ['', [Validators.required, Validators.minLength(3)]],
      user_type: ['admin', [Validators.required]],
    });
  }
}
