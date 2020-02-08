import { EngineActionResponse } from 'src/app/engine/models/engine-action-response.model';
import { AnimationDeclaration } from '../models/animation-declaration.model';
import { AnimationItem } from '../models/animation-item.model';
import { rangeBetween } from 'src/app/helpers/math.helper';
import { AnimationTileReplacement } from '../models/animation-tile-replacement.model';
import { ColorBlendingEnum } from '../models/enums/color-blending.enum';

export function waveAnimationStrategy(response: EngineActionResponse, declaration: AnimationDeclaration): AnimationItem[] {
  let startRange = 0;
  let maximumRange = 0;
  if (response.range) {
    maximumRange = response.range;
  } else {
    for (const tile of response.reachedTiles) {
      const range = rangeBetween(response.x, response.y, tile.x, tile.y);
      if (range > maximumRange) {
        maximumRange = range;
      }
    }
  }
  let endRange = declaration.progression * maximumRange;
  const tiles = response.reachedTiles.map(o => {
    const range = rangeBetween(response.x, response.y, o.x, o.y);
    return {
      x: o.x,
      y: o.y,
      range
    };
  });
  const result: AnimationItem[] = [];
  while (endRange < maximumRange) {
    const tempTiles = tiles.filter(o => {
      return o.range > startRange && o.range < endRange;
    });
    result.push({
      overlay: tempTiles.map(o => {
        let color;
        switch (declaration.colorBlending) {
          case ColorBlendingEnum.Gradient:
            color = {
              r: declaration.secondColor.r * (maximumRange - o.range) + declaration.firstColor.r * o.range,
              g: declaration.secondColor.g * (maximumRange - o.range) + declaration.firstColor.g * o.range,
              b: declaration.secondColor.b * (maximumRange - o.range) + declaration.firstColor.b * o.range,
              a: declaration.secondColor.a * (maximumRange - o.range) + declaration.firstColor.a * o.range,
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
          x: o.x,
          y: o.y
        } as AnimationTileReplacement;
      })
    } as AnimationItem);
    startRange = endRange;
    endRange += declaration.progression * maximumRange;
  }
  return result;
}
