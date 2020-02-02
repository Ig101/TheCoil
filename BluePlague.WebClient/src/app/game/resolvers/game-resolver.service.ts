import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { SceneSnapshot } from 'src/app/engine/models/scene/scene-snapshot.model';
import { EngineFacadeService } from 'src/app/engine/services/engine-facade.service';
import { tap } from 'rxjs/operators';

@Injectable()
export class GameResolverService implements Resolve<SceneSnapshot> {

  constructor(private engineFacadeService: EngineFacadeService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): SceneSnapshot | Observable<SceneSnapshot> | Promise<SceneSnapshot> {
    return this.engineFacadeService.loadGame()
      .pipe(tap(result => {
        if (!result) {
          // TODO Redirect to error
        }
      }));
  }

}
