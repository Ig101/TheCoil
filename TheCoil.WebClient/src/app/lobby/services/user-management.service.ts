import { Injectable } from '@angular/core';
import { Subject, BehaviorSubject } from 'rxjs';

@Injectable()
export class UserManagementService {

  loadingInternal = false;
  errors = new BehaviorSubject<string[]>(undefined);

  passwordWasChanged = false;
  emailWasConfirmed = false;

  timer;

  emailTimer;
  emailTime = 0;

  get loading() {
    return this.loadingInternal;
  }

  constructor() { }

  startEmailTimer(time: number) {
    this.emailTime = time;
    clearInterval(this.emailTimer);
    this.emailTimer = setInterval(() => {
      this.emailTime--;
      if (this.emailTime <= 0) {
        clearInterval(this.emailTimer);
      }
    }, 1000);
  }

  loadingStart() {
    if (this.loadingInternal) {
      return;
    }
    this.errors.next(undefined);
    this.loadingInternal = true;
    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      this.errors.next([$localize`:@@errors.timeout:Loading timeout. Try again after few time.`]);
    }, 240000);
  }

  loadingEnd(overcomeErrors: boolean = false) {
    if (!this.loadingInternal || (!overcomeErrors && this.errors.value)) {
      return;
    }
    this.errors.next(undefined);
    this.loadingInternal = false;
    clearTimeout(this.timer);
  }

  loadingError(errors: string[]) {
    this.loadingInternal = true;
    this.errors.next(errors);
  }
}
