import { Component, OnInit, OnDestroy } from '@angular/core';
import { WebCommunicationService } from 'src/app/shared/services/web-communication.service';
import { UserManagementService } from '../../services/user-management.service';
import { Router } from '@angular/router';

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
    private router: Router
    ) { }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    clearInterval(this.timer);
  }

  sendAgain() {
    this.time = 120;
    this.timer = setInterval(() => {
      this.time--;
      if (this.time <= 0) {
        clearInterval(this.timer);
      }
    }, 1000);
  }

  toSignIn() {
    this.router.navigate(['lobby']);
  }
}
