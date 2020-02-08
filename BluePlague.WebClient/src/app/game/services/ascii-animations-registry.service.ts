import { Injectable } from '@angular/core';
import { WebCommunicationService } from 'src/app/shared/services/web-communication.service';
import { EngineActionResponse } from 'src/app/engine/models/engine-action-response.model';
import { of } from 'rxjs';
import { AnimationDeclaration } from '../ascii-game/models/animation-declaration.model';
import { AnimationItem } from '../ascii-game/models/animation-item.model';
import { ActorSnapshot } from 'src/app/engine/models/scene/objects/actor-snapshot.model';

@Injectable()
export class AsciiAnimationsRegistryService {

  private declarations: { [id: string]: AnimationDeclaration };

  private strategies: { [id: string]: (response: EngineActionResponse, declaration: AnimationDeclaration) => AnimationItem[] };

  constructor(
    private webCommunicationService: WebCommunicationService
  ) { }

  loadAnimations() {
    this.declarations = {};
    return of(this.declarations);
  }

  getAnimations(response: EngineActionResponse): AnimationItem[] {
    const declaration = this.declarations[response.animation];
    if (!declaration) {
      return [{
        snapshotChanges: response.changes,
        message: response.result
      } as AnimationItem];
    }
  }
}
