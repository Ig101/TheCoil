import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { WebCommunicationService } from 'src/app/shared/services/web-communication.service';
import { UserManagementService } from '../../services/user-management.service';
import { Router } from '@angular/router';
import { UserService } from 'src/app/shared/services/user.service';
import { EmailRequest } from '../../models/email-request.model';

@Component({
  selector: 'app-email-confirmation',
  templateUrl: './email-confirmation.component.html',
  styleUrls: ['./email-confirmation.component.scss']
})
export class EmailConfirmationComponent implements OnInit, OnDestroy {

  private timer: any;
  time = 0;

  constructor(
    private webCommunicationService: WebCommunicationService,
    private userManagementService: UserManagementService,
    private userService: UserService,
    private router: Router
    ) {
    }

  ngOnInit(): void {
    setTimeout(() => {
      this.userManagementService.loadingEnd();
      if (!this.userManagementService.zeroTimer) {
        this.resetTimer();
      } else {
        this.userManagementService.zeroTimer = false;
      }
    });
  }

  ngOnDestroy(): void {
    clearInterval(this.timer);
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

  sendAgain() {
    this.userManagementService.loadingStart();
    this.webCommunicationService.post<EmailRequest, void>('api/auth/send-verification', {
      email: this.userService.email,
    })
    .subscribe(result => {
      if (result.success) {
        this.userManagementService.loadingEnd();
        this.resetTimer();
      } else {
        this.userManagementService.loadingEnd(result.errors);
      }
    });
  }

  toSignIn() {
    this.router.navigate(['lobby']);
  }
}
