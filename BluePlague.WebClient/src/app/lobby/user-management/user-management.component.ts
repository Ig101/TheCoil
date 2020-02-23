import { Component, OnInit } from '@angular/core';
import { UserManagementWindowEnum } from '../models/enum/user-management-window.enum';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.scss']
})
export class UserManagementComponent implements OnInit {

  userManagementWindowEnum = UserManagementWindowEnum;
  userState: UserManagementWindowEnum = this.userManagementWindowEnum.SignIn;

  constructor() { }

  ngOnInit(): void {
  }

}
