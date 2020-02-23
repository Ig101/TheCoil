import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { controlRequiredSilentValidator } from 'src/app/shared/validators/control-required-silent.validator';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent implements OnInit {

  form: FormGroup;

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      email: this.formBuilder.control('', [controlRequiredSilentValidator]),
      password: this.formBuilder.control('', [controlRequiredSilentValidator]),
    });
  }

  signIn() {

  }

  toSignUp() {

  }

  forgotPassword() {

  }
}
