import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { WebCommunicationService } from 'src/app/shared/services/web-communication.service';
import { Observable } from 'rxjs';
import { UserService } from '../services/user.service';
import { ActiveUser } from '../models/active-user.model';

@Injectable()
export class UserResolverService implements Resolve<ActiveUser> {
  constructor(
    private webCommunicationService: WebCommunicationService,
    private userService: UserService
    ) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): ActiveUser | Observable<ActiveUser> | Promise<ActiveUser> {
    return undefined;
  }
}
