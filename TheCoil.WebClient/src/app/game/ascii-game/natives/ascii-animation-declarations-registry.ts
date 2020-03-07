import { ColorBlendingEnum } from '../models/enums/color-blending.enum';
import { AnimationDeclaration } from '../models/animation-declaration.model';
import { EngineActionResponse } from 'src/app/engine/models/engine-action-response.model';
import { AnimationItem } from '../models/animation-item.model';

export function getAsciiAnimationDeclarationsRegistry(
  strategies: { [id: string]: (response: EngineActionResponse, declaration: AnimationDeclaration) => AnimationItem[] }):
  { [id: string]: AnimationDeclaration } {
  return {
    explosion: {
      calculationStrategy: strategies.filling,
      character: '*',
      firstColor: {r: 255, g: 155, b: 0, a: 1},
      secondColor: {r: 255, g: 0, b: 0, a: 1},
      colorBlending: ColorBlendingEnum.Gradient,
      progression: 0.4,
    }
  };
}
