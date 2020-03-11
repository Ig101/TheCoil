import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { AppFormGroup } from 'src/app/shared/components/form-group/app-form-group';
import { passwordDigitsValidator } from 'src/app/shared/validators/password-digits.validator';
import { passwordLowercaseValidator } from 'src/app/shared/validators/password-lowercase.validator';
import { passwordUppercaseValidator } from 'src/app/shared/validators/password-uppercase.validator';
import { controlMinLengthValidator } from 'src/app/shared/validators/control-min-length.validator';
import { confirmPasswordValidator } from 'src/app/shared/validators/confirm-password.validator';
import { controlRequiredSilentValidator } from 'src/app/shared/validators/control-required-silent.validator';
import { controlRequiredValidator } from 'src/app/shared/validators/control-required.validator';
import { Router } from '@angular/router';
import { UserManagementService } from '../../services/user-management.service';
import { WebCommunicationService } from 'src/app/shared/services/web-communication.service';
import { SignInRequest } from '../../models/sign-in-request.model';
import { switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { ExternalResponse } from 'src/app/shared/models/external-response.model';
import { ActiveUser } from 'src/app/shared/models/active-user.model';
import { ChangePasswordAuthorizedRequest } from '../../models/change-password-authorized-request.model';
import { UserService } from 'src/app/shared/services/user.service';
import { ComponentSizeEnum } from 'src/app/shared/models/enum/component-size.enum';

@Component({
  selector: 'app-user-settings',
  templateUrl: './user-settings.component.html',
  styleUrls: ['./user-settings.component.scss']
})
export class UserSettingsComponent implements OnInit {

  passwordForm: AppFormGroup;

  componentSizeEnum = ComponentSizeEnum;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private userManagementService: UserManagementService,
    private userService: UserService,
    private webCommunicationService: WebCommunicationService
    ) { }

  ngOnInit(): void {
    this.passwordForm = new AppFormGroup({
      currentPassword: this.formBuilder.control('', [
        controlRequiredValidator($localize`:@@controls.email:Current password`)
      ]),
      password: this.formBuilder.control('', [
        passwordDigitsValidator($localize`:@@controls.password:New password`),
        passwordLowercaseValidator($localize`:@@controls.password:New password`),
        passwordUppercaseValidator($localize`:@@controls.password:New password`),
        controlMinLengthValidator($localize`:@@controls.password:New password`, 8)
      ]),
      confirmPassword: this.formBuilder.control('', [
        confirmPasswordValidator($localize`:@@controls.confirm-password:Confirm password`)
      ])
    });
  }

  changePassword() {
    if (this.userManagementService.loading) {
      return;
    }
    const errors = this.passwordForm.appErrors;
    if (errors.length > 0) {
      this.passwordForm.controls.password.setValue('');
      this.userManagementService.loadingError(errors);
    } else {
      this.userManagementService.loadingStart();
      this.webCommunicationService.put<ChangePasswordAuthorizedRequest, void>('api/user/password', {
        currentPassword: this.passwordForm.controls.currentPassword.value,
        password: this.passwordForm.controls.password.value
      })
      .subscribe(result => {
        this.passwordForm.controls.currentPassword.setValue('');
        this.passwordForm.controls.password.setValue('');
        this.passwordForm.controls.confirmPassword.setValue('');
        if (result.success) {
          this.userService.user = undefined;
          this.userManagementService.passwordWasChanged = true;
          this.router.navigate(['lobby/signin']);
        } else {
          this.userManagementService.loadingError(result.errors);
        }
      });
    }
  }

  toLobby() {
    this.router.navigate(['lobby']);
  }

}
