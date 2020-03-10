import { Component, OnInit, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { controlRequiredSilentValidator } from 'src/app/shared/validators/control-required-silent.validator';
import { WebCommunicationService } from 'src/app/shared/services/web-communication.service';
import { Router, ActivatedRouteSnapshot, ActivatedRoute } from '@angular/router';
import { UserManagementService } from '../../services/user-management.service';
import { AppFormGroup } from 'src/app/shared/components/form-group/app-form-group';
import { switchMap } from 'rxjs/operators';
import { UserService } from 'src/app/shared/services/user.service';
import { ExternalResponse } from 'src/app/shared/models/external-response.model';
import { ActiveUser } from 'src/app/shared/models/active-user.model';
import { of } from 'rxjs';
import { SignInRequest } from '../../models/sign-in-request.model';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent implements OnInit {

  form: AppFormGroup;

  showConfirmationMessage = false;
  showPasswordWasChangedMessage = false;

  constructor(
    private formBuilder: FormBuilder,
    private webCommunicationService: WebCommunicationService,
    private userManagementService: UserManagementService,
    private userService: UserService,
    private router: Router,
    private routeSnapshot: ActivatedRoute) {
    }

  ngOnInit(): void {
    this.form = new AppFormGroup({
      email: this.formBuilder.control('', [controlRequiredSilentValidator($localize`:@@controls.email:Email`)]),
      password: this.formBuilder.control('', [controlRequiredSilentValidator($localize`:@@controls.password:Password`)]),
    });
    setTimeout(() => {
      this.showPasswordWasChangedMessage = this.userManagementService.passwordWasChanged;
      this.showConfirmationMessage = this.userManagementService.emailWasConfirmed;
      this.userManagementService.passwordWasChanged = false;
      this.userManagementService.emailWasConfirmed = false;
      if (this.userService.email) {
        this.form.controls.email.setValue(this.userService.email);
      }
      this.userManagementService.loadingEnd();
    });
  }

  signIn() {
    if (this.userManagementService.loading) {
      return;
    }
    const errors = this.form.appErrors;
    if (errors.length > 0) {
      this.form.controls.password.setValue('');
      this.userManagementService.loadingError(errors);
    } else {
      this.userManagementService.loadingStart();
      this.webCommunicationService.post<SignInRequest, void>('api/auth/signin', {
        email: this.form.controls.email.value,
        password: this.form.controls.password.value
      })
      .pipe(switchMap(result => {
        if (result.success) {
          return this.userService.getActiveUser();
        } else {
          return of(result as any as ExternalResponse<ActiveUser>);
        }
      }))
      .subscribe(result => {
        if (result.success) {
          this.userService.unauthorized = false;
          this.router.navigate(['lobby']);
        } else if (result.statusCode === 403) {
          this.userService.email = this.form.controls.email.value;
          this.router.navigate(['lobby/signup/confirmation']);
        } else {
          this.form.controls.password.setValue('');
          this.userManagementService.loadingError(result.errors);
        }
      });
    }
  }

  toSignUp() {
    this.router.navigate(['lobby/signup']);
  }

  toForgotPassword() {
    this.router.navigate(['lobby/signin/forgot-password']);
  }
}
