import { Component, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { DarkModeService } from 'src/app/services/dark-mode.service';
import { TranslateService } from '@ngx-translate/core';
import { APIRequestsService } from 'src/app/services/api-requests.service';

@Component({
  selector: 'app-reset-password-container',
  templateUrl: './reset-password-container.component.html',
  styleUrls: ['./reset-password-container.component.css'],
})
export class ResetPasswordContainerComponent implements OnInit {
  emailResetPasswordForm!: FormGroup;

  errorsMsg!: string;
  successMsg!: string;
  emailSended!: boolean;

  isDarkMode!: boolean;

  constructor(
    private readonly fb: FormBuilder,
    private apiRequest: APIRequestsService,
    private darkMode: DarkModeService,
    private metaService: Meta,
    private titleService: Title,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.darkMode.darkModeStatus.subscribe((res) => {
      this.isDarkMode = res;
    });

    const title = this.translate.instant('User Module');
    const subtitle = this.translate.instant('Reset Password');

    this.emailResetPasswordForm = this.initForm();
    this.metaService.addTags([
      { name: 'description', content: 'Módulos de usuario login' },
      { name: 'author', content: 'LucasiBai' },
      {
        name: 'keywords',
        content: 'usuarios, reset, password,login, módulo, proyectos',
      },
    ]);
    this.titleService.setTitle(`${title} | ${subtitle}`);
  }

  onSendEmail(): void {
    const email = this.emailResetPasswordForm.value['email'].trim();
    const emailPayload = { email };

    this.apiRequest.post('users/reset-password/', emailPayload).subscribe(
      (res: any) => {
        this.errorsMsg = '';
        this.successMsg = res['message'];

        this.emailSended = true;
      },
      (errors) => {
        this.errorsMsg = errors.error.email[0];
      }
    );
  }

  initForm(): FormGroup {
    return this.fb.group({
      email: [
        '',
        [Validators.required, Validators.email, Validators.minLength(3)],
      ],
    });
  }
}
