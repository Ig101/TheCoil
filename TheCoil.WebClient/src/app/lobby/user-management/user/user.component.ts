import { Component, OnInit } from '@angular/core';
import { UserManagementService } from '../../services/user-management.service';
import { UserService } from 'src/app/shared/services/user.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {

  constructor(
    private userManagementService: UserManagementService,
    private userservice: UserService
  ) { }

  ngOnInit(): void {
    setTimeout(() => this.userManagementService.loadingEnd());
  }
}
