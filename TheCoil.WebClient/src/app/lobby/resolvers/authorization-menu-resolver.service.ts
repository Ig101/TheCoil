import { Injectable } from '@angular/core';
import { Resolve, RouterStateSnapshot, ActivatedRouteSnapshot, Router } from '@angular/router';
import { UserService } from 'src/app/shared/services/user.service';
import { EMPTY, of } from 'rxjs';

@Injectable()
export class AuthorizationMenuResolverService implements Resolve<boolean> {

  constructor(
    private userService: UserService,
    private router: Router
    ) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (this.userService.user) {
      this.router.navigate(['lobby']);
      return EMPTY;
    }
    return true;
  }
}
