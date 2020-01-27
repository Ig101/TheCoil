import { Scene } from '../scene.object';

import { Actor } from '../objects/actor.object';
import { ActionResult } from './action-result.model';

export interface IncomingActionReaction<T> {
  action: (scene: Scene, object: T, initiator: Actor, weight?: number, strength?: number) => string[];
}
