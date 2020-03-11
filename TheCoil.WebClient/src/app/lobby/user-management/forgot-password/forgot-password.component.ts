import { Component, OnInit } from '@angular/core';
import { AppFormGroup } from 'src/app/shared/components/form-group/app-form-group';
import { FormBuilder } from '@angular/forms';
import { emailValidator } from 'src/app/shared/validators/email.validator';
import { WebCommunicationService } from 'src/app/shared/services/web-communication.service';
import { UserManagementService } from '../../services/user-management.service';
import { Router } from '@angular/router';
import { EmailRequest } from '../../models/email-request.model';
import { UserService } from 'src/app/shared/services/user.service';
import { ComponentSizeEnum } from 'src/app/shared/models/enum/component-size.enum';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {

  form: AppFormGroup;

  componentSizeEnum = ComponentSizeEnum;

  sent = false;

  get time() {
    return this.userManagementService.emailTime;
  }

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
      email: this.formBuilder.control('', [
        emailValidator($localize`:@@controls.email:Email`)
      ])
    });
    setTimeout(() => {
      this.userManagementService.loadingEnd();
      if (this.userService.email) {
        this.form.controls.email.setValue(this.userService.email);
      }
    });
  }

  forgotPassword() {
    if (this.userManagementService.loading) {
      return;
    }
    const errors = this.form.appErrors;
    if (errors.length > 0) {
      this.userManagementService.loadingError(errors);
    } else {
      this.userManagementService.loadingStart();
      this.webCommunicationService.post<EmailRequest, void>('api/auth/send-change-password', {
        email: this.form.controls.email.value,
      })
      .subscribe(result => {
        if (result.success) {
          this.sent = true;
          this.userManagementService.startEmailTimer(60);
          this.userManagementService.loadingEnd();
        } else {
          this.userManagementService.loadingError(result.errors);
        }
      });
    }
  }

  toSignIn() {
    this.router.navigate(['lobby']);
  }

}
