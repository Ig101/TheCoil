import { Scene } from '../../scene/scene.object';
import { Actor } from '../../scene/objects/actor.object';
import { ReactionResult } from '../../scene/models/reaction-result.model';
import { IReactiveObject } from '../../scene/interfaces/reactive-object.interface';
import { ReactionMessageLevelEnum } from '../../models/enums/reaction-message-level.enum';

export function receiveDamagePhysicalIncoming(scene: Scene, object: Actor, initiator: Actor, time: number, weight?: number,
                                              strength?: number):
    { animation: string, reaction: string, result: ReactionResult, reachedObjects: IReactiveObject[], strength?: number } {
  const calculatedStrength = strength * weight;
  object.changeDurability(-calculatedStrength);
  const reaction = {
    level: ReactionMessageLevelEnum.Information,
    message: $localize`:@@game.reaction.basic.receiveDamage.physical:${object.name}:name:
      receives ${calculatedStrength.toString()}:strength: physical damage.`
  };
  return {
    animation: 'hurt',
    reaction: 'hurt',
    result: reaction,
    reachedObjects: [object.tile, object]
  };
}

export function receiveDamageFireIncoming(scene: Scene, object: Actor, initiator: Actor, time: number, weight?: number,
                                          strength?: number):
    { animation: string, reaction: string, result: ReactionResult, reachedObjects: IReactiveObject[], strength?: number } {
  const calculatedStrength = strength * weight;
  object.changeDurability(-calculatedStrength);
  const reaction = {
    level: ReactionMessageLevelEnum.Information,
    message: $localize`:@@game.reaction.basic.receiveDamage.fire:${object.name}:name:
      receives ${calculatedStrength.toString()}:strength: fire damage.`
  };
  return {
    animation: 'hurt',
    reaction: 'hurt',
    result: reaction,
    reachedObjects: [object.tile, object]
  };
}
