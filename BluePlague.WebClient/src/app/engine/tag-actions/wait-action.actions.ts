import { Scene } from '../scene/scene.object';
import { Actor } from '../scene/objects/actor.object';
import { ActorActionResult } from '../scene/models/actor-action-result.model';
import { ActorAction } from '../scene/models/actor-action.model';

function waitAction(scene: Scene, object: Actor, x: number, y: number, externalIdentifier?: number): ActorActionResult {
  const timeShift = object.calculatedSpeedModification;
  return {
    time: timeShift,
    reactions: [],
    reachedObjects: [object.tile, ...object.tile.objects]
  };
}

export function registerWaitAction(): ActorAction {
  return {
    name: 'wait',
    group: 'wait',
    action: waitAction
  } as ActorAction;
}
