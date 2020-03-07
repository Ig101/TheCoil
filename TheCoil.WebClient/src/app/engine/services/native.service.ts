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
import { getActionsRegistry } from '../tag-actions/actions/actions-registry';
import { getActorTagsRegistry } from '../tag-actions/actor-tags/actor-tags-registry';
import { getTileTagsRegistry } from '../tag-actions/tile-tags/tile-tags-registry';
import { ActorAction } from '../scene/models/actor-action.model';
@Injectable()
export class NativeService {

  private loaded = false;

  private actors: { [id: string]: ActorNative; };
  private tiles: { [id: string]: TileNative; };
  // Internal
  private actions: { [tag: string]: ActorAction; };
  private actorTags: { [tag: string]: ActionTag<Actor>; };
  private tileTags: { [tag: string]: Tag<Tile>; };

  constructor( ) { }

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
    this.actors = {
      player: {
        id: 'player',
        name: 'player',
        sprite: {
          character: '@',
          description: '-',
          color: {r: 255, g: 255, b: 55, a: 1}
        },
        speedModificator: 5,
        weight: 100,
        maxDurability: 100,
        maxEnergy: 100,
        tags: [this.actorTags.flesh],
        actions: [this.actions.smart, this.actions.defaultAttack],
        passable: false
      },
      dummy: {
        id: 'dummy',
        name: $localize`:@@game.actor.dummy:Dummy`,
        sprite: {
          character: '&',
          description: '-',
          color: {r: 255, g: 80, b: 0, a: 1}
        },
        speedModificator: 10,
        weight: 100,
        maxDurability: 100,
        maxEnergy: 100,
        tags: [this.actorTags.cryOnWait, this.actorTags.flesh, this.actorTags.explodeOnDeath],
        actions: [this.actions.wait],
        passable: false
      }
    };
    this.tiles = {
      stoneWall: {
        id: 'stoneWall',
        name: $localize`:@@game.tile.stoneWall:Stone wall`,
        sprite: {
          character: '#',
          description: '-',
          color: {r: 220, g: 220, b: 220, a: 0.8}
        },
        backgroundColor: {r: 30, g: 30, b: 30},
        bright: false,
        tags: [],
        passable: false,
        viewable: false
      },
      stoneFloor: {
        id: 'stoneFloor',
        name: $localize`:@@game.tile.stoneFloor:Stone floor`,
        sprite: {
          character: '.',
          description: '-',
          color: {r: 120, g: 120, b: 120, a: 1}
        },
        backgroundColor: {r: 30, g: 30, b: 30},
        bright: false,
        tags: [],
        passable: true,
        viewable: true
      },
      grassFloor: {
        id: 'grassFloor',
        name: $localize`:@@game.tile.grassFloor:Grass floor`,
        sprite: {
          character: '-',
          description: '-',
          color: {r: 0, g: 250, b: 0, a: 0.8}
        },
        backgroundColor: {r: 0, g: 35, b: 0},
        bright: false,
        tags: [],
        passable: true,
        viewable: true
      },
      sandFloor: {
        id: 'sandFloor',
        name: $localize`:@@game.tile.sandFloor:Sand floor`,
        sprite: {
          character: '.',
          description: '-',
          color: {r: 244, g: 164, b: 96, a: 0.8}
        },
        backgroundColor: {r: 30, g: 20, b: 10},
        bright: false,
        tags: [],
        passable: true,
        viewable: true
      },
    };
  }

  private loadInternalNatives() {
    this.actions = getActionsRegistry();
    this.actorTags = getActorTagsRegistry();
    this.tileTags = getTileTagsRegistry();
  }
}
