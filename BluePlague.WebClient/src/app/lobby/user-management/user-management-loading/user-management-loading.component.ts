import { Component, OnInit, Input, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { UserManagementService } from '../../services/user-management.service';
import { ButtonComponent } from 'src/app/shared/components/button/button.component';

@Component({
  selector: 'app-user-management-loading',
  templateUrl: './user-management-loading.component.html',
  styleUrls: ['./user-management-loading.component.scss']
})
export class UserManagementLoadingComponent implements OnInit, AfterViewInit {

  get errors() {
    return this.userManagementService.errors;
  }

  @ViewChild('loadingOk') loadingOk: ButtonComponent;

  constructor(private userManagementService: UserManagementService) { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    if (this.loadingOk) {
      setTimeout(() => this.loadingOk.button.nativeElement.focus());
    }
  }

  loadingEnd() {
    this.userManagementService.loadingEnd(true);
  }
}
