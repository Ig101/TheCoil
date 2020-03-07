import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { AsciiAnimationsRegistryService } from '../services/ascii-animations-registry.service';

@Injectable()
export class AsciiGameResolverService implements Resolve<any> {

  constructor(
    private asciiAnimationsRegistryService: AsciiAnimationsRegistryService
    ) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): any | Observable<any> | Promise<any> {
    this.asciiAnimationsRegistryService.loadAnimations();
  }

}
