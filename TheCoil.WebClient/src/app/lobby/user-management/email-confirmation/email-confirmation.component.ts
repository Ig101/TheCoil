import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { WebCommunicationService } from 'src/app/shared/services/web-communication.service';
import { UserManagementService } from '../../services/user-management.service';
import { Router } from '@angular/router';
import { UserService } from 'src/app/shared/services/user.service';
import { EmailRequest } from '../../models/email-request.model';
import { ComponentSizeEnum } from 'src/app/shared/models/enum/component-size.enum';

@Component({
  selector: 'app-email-confirmation',
  templateUrl: './email-confirmation.component.html',
  styleUrls: ['./email-confirmation.component.scss']
})
export class EmailConfirmationComponent implements OnInit, OnDestroy {

  componentSizeEnum = ComponentSizeEnum;

  get time() {
    return this.userManagementService.emailTime;
  }

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
    });
  }

  ngOnDestroy(): void { }

  sendAgain() {
    this.userManagementService.loadingStart();
    this.webCommunicationService.post<EmailRequest, void>('api/auth/send-verification', {
      email: this.userService.email,
    })
    .subscribe(result => {
      if (result.success) {
        this.userManagementService.startEmailTimer(60);
        this.userManagementService.loadingEnd();
      } else {
        this.userManagementService.loadingError(result.errors);
      }
    });
  }

  toSignIn() {
    this.router.navigate(['lobby']);
  }
}
