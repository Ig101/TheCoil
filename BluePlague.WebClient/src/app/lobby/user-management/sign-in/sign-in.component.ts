import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { controlRequiredSilentValidator } from 'src/app/shared/validators/control-required-silent.validator';
import { WebCommunicationService } from 'src/app/shared/services/web-communication.service';
import { Router, ActivatedRouteSnapshot, ActivatedRoute } from '@angular/router';
import { UserManagementService } from '../../services/user-management.service';
import { AppFormGroup } from 'src/app/shared/components/form-group/app-form-group';
import { SignInForm } from '../../models/sign-in-form.model';
import { switchMap } from 'rxjs/operators';
import { UserService } from 'src/app/shared/services/user.service';
import { ExternalResponse } from 'src/app/shared/models/external-response.model';
import { ActiveUser } from 'src/app/shared/models/active-user.model';
import { of } from 'rxjs';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent implements OnInit {

  form: AppFormGroup;

  showConfirmationMessage = false;

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
    setTimeout(() => this.userManagementService.loadingEnd());
  }

  signIn() {
    const errors = this.form.appErrors;
    if (errors.length > 0) {
      this.userManagementService.loadingStart(errors);
    } else {
      this.userManagementService.loadingStart();
      this.webCommunicationService.post<SignInForm, void>('api/auth/signin', {
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
          this.userManagementService.loadingEnd();
        } else if (result.statusCode === 403) {
          this.userService.email = this.form.controls.email.value;
          this.router.navigate(['lobby/signup/confirmation']);
        } else {
          this.userManagementService.loadingEnd(result.errors);
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
