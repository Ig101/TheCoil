import { Injectable } from '@angular/core';
import { SceneSnapshot } from '../models/scene/scene-snapshot.model';
import { EnginePlayerAction } from '../models/engine-player-action.model';
import { MetaInformation } from '../models/meta-information.model';
import { Observable, of } from 'rxjs';
import { EngineSnapshot } from '../models/engine-snapshot.model';
import { WebCommunicationService } from 'src/app/shared/services/web-communication.service';
import { ExternalResponse } from 'src/app/shared/models/external-response.model';
import { renderFlagCheckIfStmt } from '@angular/compiler/src/render3/view/template';
import { RoomTypeEnum } from '../models/enums/room-type.enum';
import { SceneSavedData } from '../models/scene/scene-saved-data.model';

@Injectable()
export class SynchronizationService {

  constructor(
    private readonly webCommunicationService: WebCommunicationService
  ) { }

  sendSynchronizationInfo(scene: SceneSavedData, meta: MetaInformation,
                          actions: EnginePlayerAction[]): Observable<ExternalResponse<EngineSnapshot>> {
    meta.turn = scene.turn;
    return of({
      success: true,
      result: {
        meta,
        scene
      } as EngineSnapshot
    } as ExternalResponse<EngineSnapshot>);
  }

  loadGame(): Observable<ExternalResponse<EngineSnapshot>> {
    return of({
      success: true,
      result: {
        meta: {
          difficulty: 0,
          dungeon: 'world',
          depth: 0,
          seed: 0,
          roomType: RoomTypeEnum.World
        } as MetaInformation,
        scene: {
          turn: 0,
          changedActors: [{

          }],
          deletedActors: [],
          changedTiles: [],
          unsettledActors: []
        } as SceneSavedData
      } as EngineSnapshot
    } as ExternalResponse<EngineSnapshot>);
  }
}
