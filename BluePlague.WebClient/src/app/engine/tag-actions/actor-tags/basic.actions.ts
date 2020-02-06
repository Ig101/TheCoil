import { Scene } from '../../scene/scene.object';
import { Actor } from '../../scene/objects/actor.object';
import { ReactionResult } from '../../scene/models/reaction-result.model';
import { IReactiveObject } from '../../scene/interfaces/reactive-object.interface';
import { ReactionMessageLevelEnum } from '../../models/enums/reaction-message-level.enum';

export function receiveDamageAttackIncoming(scene: Scene, object: Actor, initiator: Actor, time: number, weight?: number,
                                            strength?: number):
    { type: string, group: string, reaction: ReactionResult, reachedObjects: IReactiveObject[], strength?: number } {
  const calculatedStrength = strength * weight;
  object.changeDurability(-calculatedStrength);
  const reaction = {
    level: ReactionMessageLevelEnum.Information,
    message: [object.name, 'receives', calculatedStrength.toString(), 'damage.']
  };
  return {
    type: 'react',
    group: 'react',
    reaction,
    reachedObjects: []
  };
}
