import { Scene } from '../scene.object';
import { Actor } from '../objects/actor.object';
import { ActionResult } from './action-result.model';

export interface OutgoingActionReaction {
  validator?: (scene: Scene, actor: Actor, x: number, y: number) => boolean;
  action: (scene: Scene, object: Actor, x: number, y: number, weight?: number, strength?: number) => ActionResult;
}
