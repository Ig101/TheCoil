import { Scene } from '../scene/scene.object';
import { ActionResult } from '../scene/models/action-result.model';
import { Actor } from '../scene/objects/actor.object';

export function waitableWaitOutgoing(scene: Scene, object: Actor, x: number, y: number,
                                     weight: number = 1, strength?: number): ActionResult {
  const timeShift = object.calculatedSpeedModification * weight;
  return {
    time: timeShift,
    message: null
  } as ActionResult;
}
