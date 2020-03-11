import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { controlMinLengthValidator } from 'src/app/shared/validators/control-min-length.validator';
import { controlMaxLengthValidator } from 'src/app/shared/validators/control-max-length-validator';
import { controlLettersDigitsValidator } from 'src/app/shared/validators/control-letters-digits.validator';
import { emailValidator } from 'src/app/shared/validators/email.validator';
import { passwordDigitsValidator } from 'src/app/shared/validators/password-digits.validator';
import { passwordLowercaseValidator } from 'src/app/shared/validators/password-lowercase.validator';
import { passwordUppercaseValidator } from 'src/app/shared/validators/password-uppercase.validator';
import { confirmPasswordValidator } from 'src/app/shared/validators/confirm-password.validator';
import { WebCommunicationService } from 'src/app/shared/services/web-communication.service';
import { UserManagementService } from '../../services/user-management.service';
import { Router } from '@angular/router';
import { AppFormGroup } from 'src/app/shared/components/form-group/app-form-group';
import { SignUpRequest } from '../../models/sign-up-request.model';
import { UserService } from 'src/app/shared/services/user.service';
import { ComponentSizeEnum } from 'src/app/shared/models/enum/component-size.enum';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit {

  form: AppFormGroup;

  componentSizeEnum = ComponentSizeEnum;

  constructor(
    private formBuilder: FormBuilder,
    private webCommunicationService: WebCommunicationService,
    private userManagementService: UserManagementService,
    private userService: UserService,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    this.form = new AppFormGroup({
      name: this.formBuilder.control('', [
        controlLettersDigitsValidator($localize`:@@controls.name:Name`),
        controlMinLengthValidator($localize`:@@controls.name:Name`, 3),
        controlMaxLengthValidator($localize`:@@controls.name:Name`, 20)
      ]),
      email: this.formBuilder.control('', [
        emailValidator($localize`:@@controls.email:Email`)
      ]),
      password: this.formBuilder.control('', [
        passwordDigitsValidator($localize`:@@controls.password:Password`),
        passwordLowercaseValidator($localize`:@@controls.password:Password`),
        passwordUppercaseValidator($localize`:@@controls.password:Password`),
        controlMinLengthValidator($localize`:@@controls.password:Password`, 8)
      ]),
      confirmPassword: this.formBuilder.control('', [
        confirmPasswordValidator($localize`:@@controls.confirm-password:Confirm password`)
      ])
    });
    setTimeout(() => {
      if (this.userService.email) {
        this.form.controls.email.setValue(this.userService.email);
      }
      this.userManagementService.loadingEnd();
    });
  }

  signUp() {
    if (this.userManagementService.loading) {
      return;
    }
    const errors = this.form.appErrors;
    if (errors.length > 0) {
      this.userManagementService.loadingError(errors);
      this.form.controls.password.setValue('');
      this.form.controls.confirmPassword.setValue('');
    } else {
      this.userManagementService.loadingStart();
      this.webCommunicationService.post<SignUpRequest, void>('api/auth/signup', {
        name: this.form.controls.name.value,
        email: this.form.controls.email.value,
        password: this.form.controls.password.value
      })
      .subscribe(result => {
        if (result.success) {
          this.userService.email = this.form.controls.email.value;
          this.userManagementService.startEmailTimer(60);
          this.router.navigate(['lobby/signup/confirmation']);
        } else {
          this.form.controls.password.setValue('');
          this.form.controls.confirmPassword.setValue('');
          this.userManagementService.loadingError(result.errors);
        }
      });
    }
  }

  toSignIn() {
    this.router.navigate(['lobby']);
  }

}
