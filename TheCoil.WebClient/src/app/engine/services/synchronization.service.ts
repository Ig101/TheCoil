import { Injectable } from '@angular/core';
import { SceneSnapshot } from '../models/scene/scene-snapshot.model';
import { EnginePlayerAction } from '../models/engine-player-action.model';
import { Observable, of } from 'rxjs';
import { WebCommunicationService } from 'src/app/shared/services/web-communication.service';
import { ExternalResponse } from 'src/app/shared/models/external-response.model';
import { renderFlagCheckIfStmt } from '@angular/compiler/src/render3/view/template';
import { RoomTypeEnum } from '../models/enums/room-type.enum';
import { ActorSavedData } from '../models/scene/objects/actor-saved-data.model';
import { GameStateEnum } from '../models/enums/game-state.enum';
import { EngineAction } from '../models/engine-action.model';
import { GameStateSavedData } from '../models/game-state-saved-data.model';
import { SceneSegmentSavedData } from '../models/scene-segment-saved-data.model';
import { PlayerSavedData } from '../models/player-saved-data.model';
import { FullGameStateSavedData } from '../models/full-game-state-saved-data.model';
import { MetaInformation } from '../models/meta-information.model';

@Injectable()
export class SynchronizationService {

  constructor(
    private readonly webCommunicationService: WebCommunicationService
  ) { }

  sendSynchronizationInfo(scenes: SceneSegmentSavedData[], metaInformation: MetaInformation,
                          player: PlayerSavedData): Observable<ExternalResponse<GameStateSavedData>> {
    console.groupCollapsed('sceneSynchronization');
    console.log(scenes),
    console.log(metaInformation),
    console.log(player),
    console.groupEnd();
    return of({
      success: true,
      result: {
        sceneSegments: {},
        needRefresh: false,
        unsettledActors: []
      } as GameStateSavedData
    } as ExternalResponse<GameStateSavedData>);
  }

  loadGame(): Observable<ExternalResponse<FullGameStateSavedData>> {
    return of({
      success: true,
      result: {
        needRefresh: false,
        sceneSegments: [
          {
            seed: 0,
            roomType: RoomTypeEnum.Demo,
            difficulty: 0,
            id: 1,
            nextId: 2,
            actors: [],
            tiles: []
          } as SceneSegmentSavedData,
          {
            seed: 0,
            roomType: RoomTypeEnum.Demo,
            difficulty: 1,
            id: 2,
            nextId: 3,
            actors: [
              {
                nativeId: 'dummy',
                durability: 20,
                energy: 100,
                remainedTurnTime: 0,
                x: 10,
                y: 20,
                id: 2
              } as ActorSavedData
            ],
            tiles: []
          } as SceneSegmentSavedData,
          {
            seed: 0,
            roomType: RoomTypeEnum.Demo,
            difficulty: 2,
            id: 3,
            actors: [
              {
                nativeId: 'dummy',
                durability: 20,
                energy: 100,
                remainedTurnTime: 0,
                x: 10,
                y: 6,
                id: 3
              } as ActorSavedData
            ],
            tiles: []
          } as SceneSegmentSavedData
        ],
        player: {
          scene: 1,
          actor: {
            nativeId: 'player',
            name: 'harry',
            durability: 100,
            energy: 100,
            remainedTurnTime: 0,
            x: 40,
            y: 6,
            id: 1
          }
        } as PlayerSavedData,
        unsettledActors: [],
        metaInformation: {
          session: 'GGGG',
          incrementor: 4,
          width: 50,
          height: 26,
          gameState: GameStateEnum.Pending,
          turn: 0
        }
      } as FullGameStateSavedData
    } as ExternalResponse<FullGameStateSavedData>);
  }
}
