import { Component, OnInit } from '@angular/core';
import { AppFormGroup } from 'src/app/shared/components/form-group/app-form-group';
import { FormBuilder } from '@angular/forms';
import { emailValidator } from 'src/app/shared/validators/email.validator';
import { WebCommunicationService } from 'src/app/shared/services/web-communication.service';
import { UserManagementService } from '../../services/user-management.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {

  form: AppFormGroup;

  sent = false;

  constructor(
    private formBuilder: FormBuilder,
    private webCommunicationService: WebCommunicationService,
    private userManagementService: UserManagementService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.form = new AppFormGroup({
      email: this.formBuilder.control('', [
        emailValidator($localize`:@@controls.email:Email`)
      ])
    });
  }

  forgotPassword() {
    const errors = this.form.appErrors;
    if (errors.length > 0) {
      this.userManagementService.loadingStart(errors);
    } else {
      console.log('signin');
    }
  }

  toSignIn() {
    this.router.navigate(['lobby']);
  }

}
