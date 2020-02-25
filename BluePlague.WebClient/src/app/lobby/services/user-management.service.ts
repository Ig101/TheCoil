import { Injectable } from '@angular/core';

@Injectable()
export class UserManagementService {

  loadingInternal = false;
  errors: string[];

  zeroTimer = false;
  passwordWasChanged = false;
  emailWasConfirmed = false;

  timer;

  get loading() {
    return this.loadingInternal;
  }

  constructor() { }

  loadingStart(errors?: string[]) {
    if (this.loadingInternal) {
      return;
    }
    this.loadingInternal = true;
    if (errors) {
      this.errors = errors;
    } else {
      this.timer = setTimeout(() => {
        this.errors = [$localize`:@@errors.timeout:Loading timeout. Try again after few time.`];
      }, 240000);
    }
  }

  loadingEnd(errors?: string[]) {
    if (!this.loadingInternal) {
      return;
    }
    this.errors = errors;
    if (!this.errors) {
      this.loadingInternal = false;
    }
    clearTimeout();
  }
}
