import { Injectable } from '@angular/core';
import { WebCommunicationService } from 'src/app/shared/services/web-communication.service';
import { RoomTypeEnum } from '../models/enums/room-type.enum';
import { Observable, of } from 'rxjs';
import { SceneInitialization } from '../models/scene/scene-initialization.model';
import { RandomService } from 'src/app/shared/services/random.service';
import { TileInitialization } from '../models/scene/tile-initialization.model';
import { NativeService } from './native.service';

@Injectable({
  providedIn: 'root'
})
export class GeneratorService {

  constructor(
    private randomService: RandomService,
    private nativeService: NativeService
  ) { }

  generateScene(roomType: RoomTypeEnum, seed?: number): Observable<SceneInitialization> {
    const ini = {
      global: false,
      scale: 1,
      tiles: [],
      width: 57,
      height: 19
    } as SceneInitialization;
    for (let i = 0; i < 300; i++) {
      ini.tiles.push({
        x: this.randomService.next(false, 0, 56),
        y: this.randomService.next(false, 0, 18),
        native: this.nativeService.getTile('tree')
      } as TileInitialization);
    }
    return of(ini);
  }
}
