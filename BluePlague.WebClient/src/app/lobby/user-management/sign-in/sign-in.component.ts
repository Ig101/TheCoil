import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { controlRequiredSilentValidator } from 'src/app/shared/validators/control-required-silent.validator';
import { WebCommunicationService } from 'src/app/shared/services/web-communication.service';
import { Router, ActivatedRouteSnapshot, ActivatedRoute } from '@angular/router';
import { UserManagementService } from '../../services/user-management.service';
import { AppFormGroup } from 'src/app/shared/components/form-group/app-form-group';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent implements OnInit {

  form: AppFormGroup;

  showConfirmationMessage = true;

  constructor(
    private formBuilder: FormBuilder,
    private webCommunicationService: WebCommunicationService,
    private userManagementService: UserManagementService,
    private router: Router,
    private routeSnapshot: ActivatedRoute) { }

  ngOnInit(): void {
    this.form = new AppFormGroup({
      email: this.formBuilder.control('', [controlRequiredSilentValidator($localize`:@@controls.email:Email`)]),
      password: this.formBuilder.control('', [controlRequiredSilentValidator($localize`:@@controls.password:Password`)]),
    });
  }

  signIn() {
    const errors = this.form.appErrors;
    if (errors.length > 0) {
      this.userManagementService.loadingStart(errors);
    } else {
      console.log('signin');
    }
  }

  toSignUp() {
    this.router.navigate(['lobby/signup']);
  }

  toForgotPassword() {
    this.router.navigate(['lobby/signin/forgot-password']);
  }
}
