import { EngineActionResponse } from 'src/app/engine/models/engine-action-response.model';
import { AnimationDeclaration } from '../models/animation-declaration.model';
import { AnimationItem } from '../models/animation-item.model';
import { ColorBlendingEnum } from '../models/enums/color-blending.enum';
import { AnimationTileReplacement } from '../models/animation-tile-replacement.model';

export function flashAnimationStrategy(response: EngineActionResponse, declaration: AnimationDeclaration): AnimationItem[] {
  let position = 0;
  const result: AnimationItem[] = [];
  while (position < 1) {
    position += declaration.progression;
    result.push({
      overlay: response.reachedTiles.map(o => {
        let color;
        let character = declaration.character;
        switch (declaration.colorBlending) {
          case ColorBlendingEnum.Gradient:
            color = {
              r: declaration.firstColor.r * (1 - position) + declaration.secondColor.r * position,
              g: declaration.firstColor.g * (1 - position) + declaration.secondColor.g * position,
              b: declaration.firstColor.b * (1 - position) + declaration.secondColor.b * position,
              a: declaration.firstColor.a * (1 - position) + declaration.secondColor.a * position,
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
          case ColorBlendingEnum.UseActorCharacterAndColor:
            character = response.actor.sprite.character;
            color = response.actor.sprite.color;
            break;
          case ColorBlendingEnum.UseActorCharacter:
            character = response.actor.sprite.character;
            color = declaration.firstColor;
            break;
          default:
            color = declaration.firstColor;
            break;
        }
        return {
          character,
          color,
          x: o.x,
          y: o.y
        } as AnimationTileReplacement;
      })
    } as AnimationItem);
  }
  result[0].message = response.result;
  result[result.length - 1].snapshotChanges = response.changes;
  return result;
}
