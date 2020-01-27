import { Scene } from '../scene/scene.object';
import { ActionResult } from '../scene/models/action-result.model';
import { Actor } from '../scene/objects/actor.object';

export function cryOnWaitWaitOutgoing(scene: Scene, object: Actor, x: number, y: number,
                                      weight: number, strength?: number): ActionResult {
  return {
    time: 0,
    message: ['cry-on-wait']
  } as ActionResult;
}
