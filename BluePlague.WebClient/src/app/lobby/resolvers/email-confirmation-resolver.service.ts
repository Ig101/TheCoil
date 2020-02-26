import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, ActivatedRoute, Router } from '@angular/router';
import { WebCommunicationService } from 'src/app/shared/services/web-communication.service';
import { Observable } from 'rxjs';
import { VerifyEmailRequest } from '../models/verify-email-request.model';
import { map } from 'rxjs/operators';
import { UserManagementService } from '../services/user-management.service';

@Injectable()
export class EmailConfirmationResolverService implements Resolve<boolean> {

  constructor(
    private webCommunicationService: WebCommunicationService,
    private router: Router,
    private userManagementService: UserManagementService
    ) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean> | Promise<boolean> {
    this.userManagementService.loadingStart();
    return this.webCommunicationService.post<VerifyEmailRequest, void>('api/auth/verify', {
      userId: route.params.id,
      code: route.params.token,
    })
    .pipe(map(result => {
      if (result.success) {
        this.userManagementService.emailWasConfirmed = true;
        this.router.navigate(['lobby/signin']);
        return true;
      } else {
        this.userManagementService.loadingError(result.errors);
        this.router.navigate(['lobby/signin']);
        return false;
      }
    }));
  }
}
