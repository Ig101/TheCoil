import { ActorSavedData } from '../models/scene/objects/actor-saved-data.model';
import { TileSavedData } from '../models/scene/tile-saved-data.model';
import { SceneSegmentSavedData } from '../models/scene-segment-saved-data.model';
import { RoomTypeEnum } from '../models/enums/room-type.enum';
import { Random } from 'src/app/shared/random/random';
import { NativeService } from '../services/native.service';
import { TileStorage } from '../models/scene/tile-storage.model';
import { SceneSegmentInformation } from '../models/scene/scene-segment-information.model';
import { Scene } from './scene.object';
import { Tile } from './tile.object';

export class SceneSegment {

  obsolete: number;

  seed: number;
  roomType: RoomTypeEnum;
  id: number;
  difficulty: number;
  tiles: TileStorage[][];
  changedTilesPosition: { x: number; y: number }[];
  random: Random;

  lastSaveTurn: number;

  nextSegment: SceneSegment;
  nextId?: number;
  previousSegment: SceneSegment;
  previousId?: number;

  changed = false;

  get sceneSegmentSavedData(): SceneSegmentSavedData {
    const actors: ActorSavedData[] = [];
    for (const xTiles of this.tiles) {
      for (const tile of xTiles) {
        if (tile) {
          actors.push(...tile.objects);
        }
      }
    }
    return {
      lastSaveTurn: this.lastSaveTurn,
      seed: this.seed,
      roomType: this.roomType,
      difficulty: this.difficulty,
      actors,
      tiles: this.changedTilesPosition.map(tile => {
        return this.tiles[tile.x][tile.y];
      }),
      id: this.id,
      nextId: this.nextId,
    };
  }

  constructor(
    tiles: TileStorage[][],
    random: Random,
    savedData: SceneSegmentSavedData,
  ) {
    this.lastSaveTurn = savedData.lastSaveTurn;
    this.nextId = savedData.nextId;
    this.tiles = tiles;
    this.random = random;
    this.seed = savedData.seed;
    this.roomType = savedData.roomType;
    this.difficulty = savedData.difficulty;
    this.id = savedData.id;
    this.changedTilesPosition = savedData.tiles.map(tile => {
      return { x: tile.x, y: tile.y };
    });
    for (const tile of savedData.tiles) {
      this.updateTile(tile);
    }
    for (const actor of savedData.actors) {
      this.tiles[actor.x][actor.y].objects.push(actor);
    }
    this.resetObsolete();
  }

  resetObsolete() {
    this.obsolete = 0;
  }

  incrementObsolete() {
    this.obsolete++;
  }

  updateTile(tile: TileSavedData) {
    const tempTile = this.tiles[tile.x][tile.y];
    tempTile.nativeId = tile.nativeId;
  }

  updateSceneBySavedData(savedData: SceneSegmentSavedData) {
    this.changedTilesPosition = savedData.tiles.map(tile => {
      return { x: tile.x, y: tile.y };
    });
    for (const tile of savedData.tiles) {
      this.updateTile(tile);
    }
    for (const actor of savedData.actors) {
      this.tiles[actor.x][actor.y].objects.push(actor);
    }
  }

  saveData(turn: number, tilePositions: { x: number; y: number; }[], tiles: Tile[][]) {
    this.lastSaveTurn = turn;
    this.changed = true;
    for (const tilePosition of tilePositions) {
      const tile = tiles[tilePosition.x][tilePosition.y];
      if (tile) {
        const savedData = tile.savedData;
        this.tiles[tilePosition.x][tilePosition.y] = savedData;
        if (tile.changed && !this.changedTilesPosition.find(t => t.x === tilePosition.x && t.y === tilePosition.y)) {
          this.changedTilesPosition.push(tilePosition);
        }
      }
    }
  }
}
