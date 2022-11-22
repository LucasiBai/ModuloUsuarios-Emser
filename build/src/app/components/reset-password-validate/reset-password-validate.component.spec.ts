import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResetPasswordValidateComponent } from './reset-password-validate.component';

describe('ResetPasswordValidateComponent', () => {
  let component: ResetPasswordValidateComponent;
  let fixture: ComponentFixture<ResetPasswordValidateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResetPasswordValidateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResetPasswordValidateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
