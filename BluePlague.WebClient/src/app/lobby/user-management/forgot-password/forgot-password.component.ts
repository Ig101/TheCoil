import { Component, OnInit } from '@angular/core';
import { AppFormGroup } from 'src/app/shared/components/form-group/app-form-group';
import { FormBuilder } from '@angular/forms';
import { emailValidator } from 'src/app/shared/validators/email.validator';
import { WebCommunicationService } from 'src/app/shared/services/web-communication.service';
import { UserManagementService } from '../../services/user-management.service';
import { Router } from '@angular/router';
import { EmailRequest } from '../../models/email-request.model';
import { UserService } from 'src/app/shared/services/user.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {

  form: AppFormGroup;

  private timer: any;
  time = 0;

  sent = false;

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

  resetTimer() {
    this.time = 120;
    clearInterval(this.timer);
    this.timer = setInterval(() => {
      this.time--;
      if (this.time <= 0) {
        clearInterval(this.timer);
      }
    }, 1000);
  }

  forgotPassword() {
    const errors = this.form.appErrors;
    if (errors.length > 0) {
      this.userManagementService.loadingStart(errors);
    } else {
      this.userManagementService.loadingStart();
      this.webCommunicationService.post<EmailRequest, void>('api/auth/send-change-password', {
        email: this.form.controls.email.value,
      })
      .subscribe(result => {
        if (result.success) {
          this.sent = true;
          this.userManagementService.loadingEnd();
          this.resetTimer();
        } else {
          this.userManagementService.loadingEnd(result.errors);
        }
      });
    }
  }

  toSignIn() {
    this.router.navigate(['lobby']);
  }

}
