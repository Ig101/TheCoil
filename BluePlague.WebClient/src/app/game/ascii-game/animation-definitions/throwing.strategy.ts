import { EngineActionResponse } from 'src/app/engine/models/engine-action-response.model';
import { AnimationDeclaration } from '../models/animation-declaration.model';
import { AnimationItem } from '../models/animation-item.model';
import { rangeBetween } from 'src/app/helpers/math.helper';
import { ColorBlendingEnum } from '../models/enums/color-blending.enum';
import { AnimationTileReplacement } from '../models/animation-tile-replacement.model';

export function throwingStrategy(response: EngineActionResponse, declaration: AnimationDeclaration): AnimationItem[] {
  let position = declaration.progression;
  const result: AnimationItem[] = [];
  while (position < 1) {
    result.push({
      overlay: response.reachedTiles.map(o => {
        let color;
        switch (declaration.colorBlending) {
          case ColorBlendingEnum.Gradient:
            color = {
              r: declaration.secondColor.r * (1 - position) + declaration.firstColor.r * position,
              g: declaration.secondColor.g * (1 - position) + declaration.firstColor.g * position,
              b: declaration.secondColor.b * (1 - position) + declaration.firstColor.b * position,
              a: declaration.secondColor.a * (1 - position) + declaration.firstColor.a * position,
            };
            break;
          case ColorBlendingEnum.RandomColor:
            color = {
              r: Math.random() * (declaration.secondColor.r - declaration.firstColor.r) + declaration.firstColor.r,
              g: Math.random() * (declaration.secondColor.g - declaration.firstColor.g) + declaration.firstColor.g,
              b: Math.random() * (declaration.secondColor.b - declaration.firstColor.b) + declaration.firstColor.b,
              a: Math.random() * (declaration.secondColor.a - declaration.firstColor.a) + declaration.firstColor.a,
            };
            break;
          default:
            color = declaration.firstColor;
            break;
        }
        return {
          character: declaration.character,
          color,
          x: Math.floor((o.x - response.x) * position + response.x),
          y: Math.floor((o.y - response.y) * position + response.y)
        } as AnimationTileReplacement;
      })
    } as AnimationItem);
    position += declaration.progression;
  }
  return result;
}
