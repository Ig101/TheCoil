import { AnimationItem } from './animation-item.model';
import { ActorSnapshot } from 'src/app/engine/models/scene/objects/actor-snapshot.model';
import { EngineActionResponse } from 'src/app/engine/models/engine-action-response.model';
import { ColorBlendingEnum } from './enums/color-blending.enum';

export interface AnimationDeclaration {
  calculationStrategy: (response: EngineActionResponse, declaration: AnimationDeclaration) => AnimationItem[];
  character: string;
  firstColor?: {r: number, g: number, b: number, a: number};
  secondColor?: {r: number, g: number, b: number, a: number};
  colorBlending: ColorBlendingEnum;
  progression: number; // 1 for 1 turn progression
}
