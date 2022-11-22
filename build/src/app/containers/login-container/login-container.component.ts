import { Component } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from 'src/app/services/auth.service';
import { DarkModeService } from 'src/app/services/dark-mode.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-login-container',
  templateUrl: './login-container.component.html',
  styleUrls: ['./login-container.component.css'],
})
export class LoginContainerComponent {
  loginForm!: FormGroup;

  errorsMsg!: string;

  isDarkMode: boolean = this.darkMode.getDarkModeStatus();

  constructor(
    private readonly fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private darkMode: DarkModeService,
    private metaService: Meta,
    private titleService: Title,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    const title = this.translate.instant('User Module');
    const subtitle = this.translate.instant('Login');

    this.loginForm = this.initForm();
    this.metaService.addTags([
      { name: 'description', content: 'Módulos de usuario login' },
      { name: 'author', content: 'LucasiBai' },
      { name: 'keywords', content: 'usuarios, login, módulo, proyectos' },
    ]);
    this.titleService.setTitle(`${title} | ${subtitle}`);
  }

  onLogin(): void {
    this.authService.login(this.loginForm.value).subscribe(
      (res) => {
        this.errorsMsg = '';
        this.router.navigateByUrl('/home');
      },
      (errors) => {
        this.errorsMsg = errors.error.message;
      }
    );
  }

  initForm(): FormGroup {
    return this.fb.group({
      email: [
        '',
        [Validators.required, Validators.email, Validators.minLength(3)],
      ],
      password: ['', [Validators.required, Validators.minLength(3)]],
    });
  }
}
