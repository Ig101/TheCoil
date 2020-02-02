import { Injectable } from '@angular/core';
import { WebCommunicationService } from 'src/app/shared/services/web-communication.service';
import { Observable, Subject, of } from 'rxjs';
import { ExternalResponse } from 'src/app/shared/models/external-response.model';
import { RoomTypeEnum } from '../models/enums/room-type.enum';
import { Tag } from '../scene/models/tag.model';
import { Actor } from '../scene/objects/actor.object';
import { Tile } from '../scene/tile.object';
import { ActorNative } from '../models/natives/actor-native.model';
import { TileNative } from '../models/natives/tile-native.model';
import { SpriteNative } from '../models/natives/sprite-native.model';
import { ActionTag } from '../scene/models/action-tag.model';
import { getActionsRegistry } from '../tag-actions/actions-registry';
import { getActorTagsRegistry } from '../tag-actions/actor-tags-registry';
import { getTileTagsRegistry } from '../tag-actions/tile-tags-registry';
import { ActorAction } from '../scene/models/actor-action.model';
import { SceneInitialization } from '../models/scene/scene-initialization.model';

@Injectable()
export class NativeService {

  private loaded = false;

  private actors: { [id: string]: ActorNative; };
  private tiles: { [id: string]: TileNative; };
  private sprites: { [id: string]: SpriteNative; };
  // Internal
  private actions: { [tag: string]: ActorAction; };
  private actorTags: { [tag: string]: ActionTag<Actor>; };
  private tileTags: { [tag: string]: Tag<Tile>; };

  constructor(
    private webCommunicationService: WebCommunicationService
  ) { }

  loadNatives(): Observable<ExternalResponse<any>> {
    if (!this.loaded) {
      this.loadInternalNatives();
      this.loadNativesFromNetworkMock();
      this.loaded = true;
    }
    return of({
      success: true
    } as ExternalResponse<any>);
  }

  getActor(id: string): ActorNative {
    return this.actors[id];
  }

  getTile(id: string): TileNative {
    return this.tiles[id];
  }

  // temporary
  private loadNativesFromNetworkMock() {
    this.sprites = {
      player: {
        character: '@',
        color: {r: 255, g: 255, b: 55, a: 1}
      },
      stoneFloor: {
        character: '.',
        color: {r: 120, g: 120, b: 120, a: 1}
      },
      stoneWall: {
        character: '#',
        color: {r: 200, g: 200, b: 200, a: 1}
      }
    };
    this.actors = {
      player: {
        id: 'player',
        name: 'player',
        sprite: this.sprites.player,
        speedModificator: 5,
        weight: 100,
        maxDurability: 100,
        maxEnergy: 100,
        tags: [],
        actions: [this.actions.wait, this.actions.move],
        passable: false
      }
    };
    this.tiles = {
      defaultDemo: {
        id: 'defaultDemo',
        name: 'stoneFloor',
        bright: false,
        tags: [],
        passable: false
      },
      stoneWall: {
        id: 'stoneWall',
        name: 'stoneWall',
        sprite: this.sprites.stoneWall,
        backgroundColor: {r: 20, g: 20, b: 20},
        bright: false,
        tags: [],
        passable: false
      },
      stoneFloor: {
        id: 'stoneFloor',
        name: 'stoneFloor',
        sprite: this.sprites.stoneFloor,
        backgroundColor: {r: 20, g: 20, b: 20},
        bright: false,
        tags: [],
        passable: true
      },
    };
  }

  private loadInternalNatives() {
    this.actions = getActionsRegistry();
    this.actorTags = getActorTagsRegistry();
    this.tileTags = getTileTagsRegistry();
  }
}
