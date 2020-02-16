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
      width: 101,
      height: 51
    } as SceneInitialization;
    ini.tiles.push({
      x: 0,
      y: 50,
      native: this.nativeService.getTile('stoneWall')
    } as TileInitialization);
    ini.tiles.push({
      x: 0,
      y: 0,
      native: this.nativeService.getTile('stoneWall')
    } as TileInitialization);
    ini.tiles.push({
      x: 100,
      y: 50,
      native: this.nativeService.getTile('stoneWall')
    } as TileInitialization);
    ini.tiles.push({
      x: 100,
      y: 0,
      native: this.nativeService.getTile('stoneWall')
    } as TileInitialization);
    for (let x = 20; x < 80; x++) {
      for (let y = 10; y < 40; y++) {
        if (x === 20 || x === 79 || y === 10 || y === 39) {
          ini.tiles.push({
            x,
            y,
            native: this.nativeService.getTile('stoneWall')
          } as TileInitialization);
        } else {
          ini.tiles.push({
            x,
            y,
            native: this.nativeService.getTile('stoneFloor')
          } as TileInitialization);
        }
      }
    }
    return of(ini);
  }
}
