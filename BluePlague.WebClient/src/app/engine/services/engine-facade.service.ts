import { Injectable, OnInit } from '@angular/core';
import { MetaService } from './meta.service';
import { SceneService } from './scene.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { EnginePlayerAction } from '../models/engine-player-action.model';
import { EngineActionTypeEnum } from '../models/enums/engine-action-type.enum';
import { SynchronizationService } from './synchronization.service';
import { SceneSnapshot } from '../models/scene/scene-snapshot.model';
import { EngineSnapshot } from '../models/engine-snapshot.model';

@Injectable()
export class EngineFacadeService {

  private currectActionsBanch: EnginePlayerAction[];

  constructor(
    private readonly metaService: MetaService,
    private readonly sceneService: SceneService,
    private readonly synchronizationService: SynchronizationService
  ) { }

  loadGame(): Observable<SceneSnapshot> {
    return this.metaService.loadGame();
  }
}
