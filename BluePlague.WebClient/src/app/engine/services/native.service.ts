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

@Injectable()
export class NativeService {

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
    this.loadInternalNatives();
    this.loadNativesFromNetworkMock();
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
    throw new Error('Method not implemented.');
  }

  private loadInternalNatives() {
    this.actions = getActionsRegistry();
    this.actorTags = getActorTagsRegistry();
    this.tileTags = getTileTagsRegistry();
  }
}
