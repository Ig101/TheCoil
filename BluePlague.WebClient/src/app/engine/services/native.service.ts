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
        color: {r: 255, g: 255, b: 255, a: 1}
      },
      grass: {
        character: '-',
        color: {r: 50, g: 180, b: 50, a: 1}
      },
      tree: {
        character: 'Y',
        color: {r: 130, g: 52, b: 0, a: 1}
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
      defaultWorld: {
        id: 'defaultWorld',
        name: 'grass',
        sprite: this.sprites.grass,
        backgroundColor: {r: 0, g: 20, b: 0},
        bright: false,
        tags: [],
        passable: true
      },
      tree: {
        id: 'tree',
        name: 'tree',
        sprite: this.sprites.tree,
        backgroundColor: {r: 0, g: 20, b: 0},
        bright: false,
        tags: [],
        passable: true
      }
    };
  }

  private loadInternalNatives() {
    this.actions = getActionsRegistry();
    this.actorTags = getActorTagsRegistry();
    this.tileTags = getTileTagsRegistry();
  }
}
