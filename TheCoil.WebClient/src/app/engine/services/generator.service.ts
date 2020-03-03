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
    tiles[0][50] = {
      x: 0,
      y: 50,
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
    tiles[100][50] = {
      x: 100,
      y: 50,
      nativeId: 'stoneWall',
      changed: true,
      objects: []
    } as TileStorage;
    tiles[100][0] = {
      x: 100,
      y: 0,
      nativeId: 'stoneWall',
      changed: true,
      objects: []
    } as TileStorage;
    for (let x = 20; x < 80; x++) {
      for (let y = 10; y < 40; y++) {
        if (x === 20 || x === 79 || y === 10 || y === 39) {
          tiles[x][y] = {
            x,
            y,
            nativeId: 'stoneWall',
            changed: true,
            objects: []
          } as TileStorage;
        } else {
          tiles[x][y] = {
            x,
            y,
            nativeId: 'stoneFloor',
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
