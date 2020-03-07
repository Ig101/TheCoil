import { Injectable } from '@angular/core';
import { WebCommunicationService } from 'src/app/shared/services/web-communication.service';
import { RoomTypeEnum } from '../models/enums/room-type.enum';
import { Observable, of } from 'rxjs';
import { NativeService } from './native.service';
import { SceneSegment } from '../scene/scene-segment.object';
import { SceneSegmentSavedData } from '../models/scene-segment-saved-data.model';
import { TileSavedData } from '../models/scene/tile-saved-data.model';
import { Random } from 'src/app/shared/random/random';
import { TileStorage } from '../models/scene/tile-storage.model';

@Injectable()
export class GeneratorService {

  constructor() { }

  generateScene(data: SceneSegmentSavedData, width: number, height: number): SceneSegment {
    const type = data.roomType;
    const difficulty = data.difficulty;
    const random = new Random(data.seed);
    const tiles = [];
    for (let x = 0; x < width; x++) {
      tiles[x] = [];
    }
    tiles[0][25] = {
      x: 0,
      y: 25,
      nativeId: 'stoneWall',
      changed: true,
      objects: []
    } as TileStorage;
    tiles[0][0] = {
      x: 0,
      y: 0,
      nativeId: 'stoneWall',
      changed: true,
      objects: []
    } as TileStorage;
    tiles[49][25] = {
      x: 49,
      y: 25,
      nativeId: 'stoneWall',
      changed: true,
      objects: []
    } as TileStorage;
    tiles[49][0] = {
      x: 49,
      y: 0,
      nativeId: 'stoneWall',
      changed: true,
      objects: []
    } as TileStorage;
    for (let x = 2; x <= 47; x++) {
      for (let y = 2; y <= 23; y++) {
        if (x === 2 || x === 47 || y === 2 || y === 23 ||
          ((x === 20 || x === 29) && y >= 10 && y <= 15) || ((y === 10 || y === 15) && x >= 20 && x <= 29)) {
          tiles[x][y] = {
            x,
            y,
            nativeId: 'stoneWall',
            changed: true,
            objects: []
          } as TileStorage;
        } else if (x > 29 || x < 20 || y < 10 || y > 15) {
          tiles[x][y] = {
            x,
            y,
            nativeId: difficulty === 2 ? 'sand' : difficulty === 1 ? 'grass' : 'stone',
            changed: true,
            objects: []
          } as TileStorage;
        }
      }
    }
    const ini = new SceneSegment(tiles, random, data);
    return ini;
  }
}
