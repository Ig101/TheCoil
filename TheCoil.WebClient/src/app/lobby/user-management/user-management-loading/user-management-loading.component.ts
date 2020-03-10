import { Component, OnInit, Input, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { UserManagementService } from '../../services/user-management.service';
import { ButtonComponent } from 'src/app/shared/components/button/button.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-user-management-loading',
  templateUrl: './user-management-loading.component.html',
  styleUrls: ['./user-management-loading.component.scss']
})
export class UserManagementLoadingComponent implements OnInit, OnDestroy {

  errors: string[];

  errorsSub: Subscription;

  @ViewChild('loadingOk') loadingOk: ButtonComponent;

  constructor(private userManagementService: UserManagementService) { }

  ngOnInit(): void {
    this.errorsSub = this.userManagementService.errors.subscribe((errors) => {
      this.errors = errors;
      if (this.errors) {
        setTimeout(() => { this.loadingOk.button.nativeElement.focus(); });
      }
    });
  }

  ngOnDestroy(): void {
    this.errorsSub.unsubscribe();
  }


  loadingEnd() {
    this.userManagementService.loadingEnd(true);
  }
}
