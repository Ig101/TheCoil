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
import { ActorSavedData } from '../models/scene/objects/actor-saved-data.model';
import { GameStateEnum } from '../models/enums/game-state.enum';

@Injectable()
export class SynchronizationService {

  constructor(
    private readonly webCommunicationService: WebCommunicationService
  ) { }

  sendSynchronizationInfo(scene: SceneSavedData, meta: MetaInformation,
                          actions: EnginePlayerAction[]): Observable<ExternalResponse<EngineSnapshot>> {
    console.groupCollapsed('sceneSynchronization');
    console.log(scene);
    console.log(meta);
    console.log(actions);
    console.groupEnd();
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
          dungeon: 'demo',
          depth: 0,
          roomType: RoomTypeEnum.Demo,
          name: 'Demo',
          gameState: GameStateEnum.Pending
        } as MetaInformation,
        scene: {
          turn: 0,
          idIncrementor: 2,
          changedActors: [
            {
              player: true,
              nativeId: 'player',
              name: 'harry',
              durability: 100,
              energy: 100,
              remainedTurnTime: 0,
              x: 46,
              y: 25,
              id: 1
            } as ActorSavedData,
            {
              player: false,
              nativeId: 'dummy',
              durability: 20,
              energy: 100,
              remainedTurnTime: 0,
              x: 49,
              y: 25,
              id: 2
            } as ActorSavedData
          ],
          deletedActors: [],
          changedTiles: [],
          unsettledActors: []
        } as SceneSavedData
      } as EngineSnapshot
    } as ExternalResponse<EngineSnapshot>);
  }
}
