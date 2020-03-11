import { Component, OnInit } from '@angular/core';
import { UserManagementService } from '../../services/user-management.service';
import { UserService } from 'src/app/shared/services/user.service';
import { ComponentSizeEnum } from 'src/app/shared/models/enum/component-size.enum';
import { WebCommunicationService } from 'src/app/shared/services/web-communication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {

  get userName() {
    return this.userService.user.name;
  }

  get userUniqueId() {
    return this.userService.user.uniqueId;
  }

  get savedGame() {
    return this.userService.user.savedGame;
  }

  componentSizeEnum = ComponentSizeEnum;

  constructor(
    private userManagementService: UserManagementService,
    private userService: UserService,
    private webCommunicationService: WebCommunicationService,
    private router: Router
  ) { }

  ngOnInit(): void {
    setTimeout(() => this.userManagementService.loadingEnd());
  }

  newGame() {

  }

  loadGame() {

  }

  toUserSettings() {
    this.router.navigate(['lobby/settings']);
  }

  logOff() {
    this.userManagementService.loadingStart();
    this.webCommunicationService.delete('api/auth/signout')
    .subscribe((result) => {
      if (result.success) {
        this.userService.unauthorized = true;
        this.userService.user = undefined;
        this.router.navigate(['lobby/signin']);
      } else {
        this.userManagementService.loadingError(result.errors);
      }
    });
  }
}
