import { Component, OnInit, Input } from '@angular/core';
import { UserManagementService } from '../../services/user-management.service';

@Component({
  selector: 'app-user-management-loading',
  templateUrl: './user-management-loading.component.html',
  styleUrls: ['./user-management-loading.component.scss']
})
export class UserManagementLoadingComponent implements OnInit {

  get errors() {
    return this.userManagementService.errors;
  }

  constructor(private userManagementService: UserManagementService) { }

  ngOnInit(): void {
  }

  loadingEnd() {
    this.userManagementService.loadingEnd();
  }
}
