import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login-container',
  templateUrl: './login-container.component.html',
  styleUrls: ['./login-container.component.css'],
})
export class LoginContainerComponent {
  loginForm!: FormGroup;

  errorsMsg!: string;

  constructor(
    private readonly fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loginForm = this.initForm();
  }

  onLogin(): void {
    this.authService.login(this.loginForm.value).subscribe(
      (res) => {
        this.errorsMsg = '';
        this.router.navigateByUrl('/home');
      },
      (errors) => {
        this.errorsMsg = errors.error.message;
        console.log(this.errorsMsg);
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
