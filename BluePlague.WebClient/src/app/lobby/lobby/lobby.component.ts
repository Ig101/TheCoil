import { Component, OnInit } from '@angular/core';
import { UserManagementWindowEnum } from '../models/enum/user-management-window.enum';

@Component({
  selector: 'app-lobby',
  templateUrl: './lobby.component.html',
  styleUrls: ['./lobby.component.scss']
})
export class LobbyComponent implements OnInit {

  userManagementWindowEnum = UserManagementWindowEnum;
  userState: UserManagementWindowEnum = this.userManagementWindowEnum.SignIn;

  constructor() { }

  ngOnInit(): void {
  }

}
