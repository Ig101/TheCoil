import { Injectable } from '@angular/core';
import { WebCommunicationService } from 'src/app/shared/services/web-communication.service';
import { EngineActionResponse } from 'src/app/engine/models/engine-action-response.model';
import { of } from 'rxjs';
import { AnimationDeclaration } from '../ascii-game/models/animation-declaration.model';
import { AnimationItem } from '../ascii-game/models/animation-item.model';
import { ActorSnapshot } from 'src/app/engine/models/scene/objects/actor-snapshot.model';
import { waveAnimationStrategy } from '../ascii-game/animation-definitions/wave.strategy';
import { fillingAnimationStrategy } from '../ascii-game/animation-definitions/filling.strategy';
import { flashAnimationStrategy } from '../ascii-game/animation-definitions/flash.strategy';
import { throwingAnimationStrategy } from '../ascii-game/animation-definitions/throwing.strategy';
import { ColorBlendingEnum } from '../ascii-game/models/enums/color-blending.enum';

@Injectable()
export class AsciiAnimationsRegistryService {

  private declarations: { [id: string]: AnimationDeclaration };

  private strategies: { [id: string]: (response: EngineActionResponse, declaration: AnimationDeclaration) => AnimationItem[] };

  constructor(
    private webCommunicationService: WebCommunicationService
  ) { }

  loadAnimations() {
    this.strategies = {
      wave: waveAnimationStrategy,
      filling: fillingAnimationStrategy,
      flash: flashAnimationStrategy,
      throwing: throwingAnimationStrategy
    };
    this.declarations = {
      explosion: {
        calculationStrategy: this.strategies.filling,
        character: '*',
        firstColor: {r: 255, g: 155, b: 0, a: 1},
        secondColor: {r: 255, g: 0, b: 0, a: 1},
        colorBlending: ColorBlendingEnum.Gradient,
        progression: 0.4,
      }
    };
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
    return declaration.calculationStrategy(response, declaration);
  }
}
