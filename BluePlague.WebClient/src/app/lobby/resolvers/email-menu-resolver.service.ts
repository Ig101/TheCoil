import { Injectable } from '@angular/core';
import { Resolve, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { UserService } from 'src/app/shared/services/user.service';
import { EMPTY, of } from 'rxjs';

@Injectable()
export class EmailMenuResolverService implements Resolve<any> {

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
    if (!this.userService.email) {
      this.router.navigate(['lobby/signin']);
      return EMPTY;
    }
    return of();
  }
}
