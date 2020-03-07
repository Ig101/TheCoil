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
import { RoomSpawnNative } from '../models/natives/room-spawn-native.model';
import { getActorsRegistry } from '../natives/actors-registry';
import { getTilesRegistry } from '../natives/tiles-registry';
import { getSpawnsRegistry } from '../natives/spawns-registry';
@Injectable()
export class NativeService {

  private loaded = false;

  private actors: { [id: string]: ActorNative; };
  private tiles: { [id: string]: TileNative; };
  private roomSpawns: RoomSpawnNative[];
  private actions: { [tag: string]: ActorAction; };
  private actorTags: { [tag: string]: ActionTag<Actor>; };
  private tileTags: { [tag: string]: Tag<Tile>; };

  constructor( ) { }

  loadNatives() {
    if (!this.loaded) {
      this.actions = getActionsRegistry();
      this.actorTags = getActorTagsRegistry();
      this.tileTags = getTileTagsRegistry();
      this.actors = getActorsRegistry(this.actions, this.actorTags);
      this.tiles = getTilesRegistry(this.tileTags);
      this.roomSpawns = getSpawnsRegistry();
      this.loaded = true;
    }
  }

  getActor(id: string): ActorNative {
    return this.actors[id];
  }

  getTile(id: string): TileNative {
    return this.tiles[id];
  }

  getRoomSpawnList(roomType: RoomTypeEnum, difficulty: number) {
    return this.roomSpawns.filter(x => x.minDifficulty <= difficulty && x.maxDifficulty >= difficulty && x.roomTypes.includes(roomType));
  }
}
