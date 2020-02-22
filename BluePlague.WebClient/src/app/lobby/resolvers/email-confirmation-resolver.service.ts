import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { WebCommunicationService } from 'src/app/shared/services/web-communication.service';
import { Observable } from 'rxjs';

@Injectable()
export class EmailConfirmationResolverService implements Resolve<boolean> {
  constructor(
    private webCommunicationService: WebCommunicationService
    ) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean> | Promise<boolean> {
    return true;
  }
}
