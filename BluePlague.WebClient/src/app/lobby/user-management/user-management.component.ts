import { Component, OnInit } from '@angular/core';
import { UserManagementWindowEnum } from '../models/enum/user-management-window.enum';
import { WebCommunicationService } from 'src/app/shared/services/web-communication.service';
import { FormGroup } from '@angular/forms';
import { UserManagementService } from '../services/user-management.service';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.scss']
})
export class UserManagementComponent implements OnInit {

  userManagementWindowEnum = UserManagementWindowEnum;
  userState: UserManagementWindowEnum = this.userManagementWindowEnum.SignIn;

  get loading() {
    return this.userManagementService.loading;
  }

  constructor(
    private userManagementService: UserManagementService
    ) { }

  ngOnInit(): void {
  }
}
