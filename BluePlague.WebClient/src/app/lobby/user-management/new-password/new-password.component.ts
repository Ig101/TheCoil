import { Component, OnInit } from '@angular/core';
import { AppFormGroup } from 'src/app/shared/components/form-group/app-form-group';
import { FormBuilder } from '@angular/forms';
import { WebCommunicationService } from 'src/app/shared/services/web-communication.service';
import { UserManagementService } from '../../services/user-management.service';
import { Router } from '@angular/router';
import { passwordDigitsValidator } from 'src/app/shared/validators/password-digits.validator';
import { passwordLowercaseValidator } from 'src/app/shared/validators/password-lowercase.validator';
import { passwordUppercaseValidator } from 'src/app/shared/validators/password-uppercase.validator';
import { controlMinLengthValidator } from 'src/app/shared/validators/control-min-length.validator';
import { confirmPasswordValidator } from 'src/app/shared/validators/confirm-password.validator';

@Component({
  selector: 'app-new-password',
  templateUrl: './new-password.component.html',
  styleUrls: ['./new-password.component.scss']
})
export class NewPasswordComponent implements OnInit {

  form: AppFormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private webCommunicationService: WebCommunicationService,
    private userManagementService: UserManagementService,
    private router: Router
  ) {
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
    const errors = this.form.appErrors;
    if (errors.length > 0) {
      this.userManagementService.loadingStart(errors);
    } else {
      console.log('pchange');
    }
  }

  toSignIn() {
    this.router.navigate(['lobby']);
  }

}
