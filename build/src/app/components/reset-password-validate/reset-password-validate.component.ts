import { Component } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { DarkModeService } from 'src/app/services/dark-mode.service';
import { TranslateService } from '@ngx-translate/core';
import { APIRequestsService } from 'src/app/services/api-requests.service';

@Component({
  selector: 'app-reset-password-Validate',
  templateUrl: './reset-password-Validate.component.html',
  styleUrls: ['./reset-password-Validate.component.css'],
})
export class ResetPasswordValidateComponent {
  resetPasswordForm!: FormGroup;

  token!: string;
  encodedPk!: string;

  errorsMsg!: string;
  successMsg!: string;
  passwordChanged!: boolean;

  isDarkMode: boolean = this.darkMode.getDarkModeStatus();

  constructor(
    private readonly fb: FormBuilder,
    private apiRequest: APIRequestsService,
    private darkMode: DarkModeService,
    private metaService: Meta,
    private titleService: Title,
    private translate: TranslateService,
    private readonly route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const title = this.translate.instant('User Module');
    const subtitle = this.translate.instant('Reset Password');

    this.route.params.subscribe(({ token }) => (this.token = token));
    this.route.params.subscribe(
      ({ encodedPk }) => (this.encodedPk = encodedPk)
    );

    this.resetPasswordForm = this.initForm();
    this.metaService.addTags([
      { name: 'description', content: 'Módulos de usuario login' },
      { name: 'author', content: 'LucasiBai' },
      {
        name: 'keywords',
        content: 'usuarios, reset, password, login, módulo, proyectos',
      },
    ]);
    this.titleService.setTitle(`${title} | ${subtitle}`);
  }

  onChangePassword(): void {
    this.apiRequest
      .updateValue(`users/reset-password/${this.encodedPk}/${this.token}/`, {
        password: this.resetPasswordForm.value['password'],
      })
      .subscribe(
        (res: any) => {
          this.errorsMsg = '';
          this.successMsg = res['message'];

          this.passwordChanged = true;
        },
        (errors) => {
          this.errorsMsg = 'The current link is disabled';
        }
      );
  }

  initForm(): FormGroup {
    return this.fb.group({
      password: ['', [Validators.required, Validators.minLength(5)]],
      repeatPassword: ['', [Validators.required, Validators.minLength(5)]],
    });
  }
}
