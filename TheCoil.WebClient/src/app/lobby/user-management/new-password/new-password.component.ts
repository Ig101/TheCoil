import { Component, OnInit } from '@angular/core';
import { AppFormGroup } from 'src/app/shared/components/form-group/app-form-group';
import { FormBuilder } from '@angular/forms';
import { WebCommunicationService } from 'src/app/shared/services/web-communication.service';
import { UserManagementService } from '../../services/user-management.service';
import { Router, ActivatedRoute } from '@angular/router';
import { passwordDigitsValidator } from 'src/app/shared/validators/password-digits.validator';
import { passwordLowercaseValidator } from 'src/app/shared/validators/password-lowercase.validator';
import { passwordUppercaseValidator } from 'src/app/shared/validators/password-uppercase.validator';
import { controlMinLengthValidator } from 'src/app/shared/validators/control-min-length.validator';
import { confirmPasswordValidator } from 'src/app/shared/validators/confirm-password.validator';
import { ChangePasswordRequest } from '../../models/change-password-request.model';
import { UserService } from 'src/app/shared/services/user.service';
import { ComponentSizeEnum } from 'src/app/shared/models/enum/component-size.enum';

@Component({
  selector: 'app-new-password',
  templateUrl: './new-password.component.html',
  styleUrls: ['./new-password.component.scss']
})
export class NewPasswordComponent implements OnInit {

  form: AppFormGroup;
  code: string;
  id: string;

  componentSizeEnum = ComponentSizeEnum;

  constructor(
    private formBuilder: FormBuilder,
    private webCommunicationService: WebCommunicationService,
    private userManagementService: UserManagementService,
    private userService: UserService,
    private router: Router,
    activatedRoute: ActivatedRoute
  ) {
    this.code = activatedRoute.snapshot.params.token;
    this.id = activatedRoute.snapshot.params.id;
  }

  ngOnInit(): void {
    this.form = new AppFormGroup({
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
    setTimeout(() => this.userManagementService.loadingEnd());
  }

  changePassword() {
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
      this.webCommunicationService.post<ChangePasswordRequest, void>('api/auth/change-password', {
        userId: this.id,
        code: this.code,
        password: this.form.controls.password.value
      })
      .subscribe(result => {
        if (result.success) {
          this.userService.user = undefined;
          this.userManagementService.passwordWasChanged = true;
          this.router.navigate(['lobby/signin']);
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
