import { Scene } from '../scene.object';

import { Actor } from '../objects/actor.object';
import { ActionResult } from './action-result.model';

export interface IncomingActionReaction<T> {
  action: (scene: Scene, object: T, initiator: Actor, time: number, weight?: number, strength?: number) => string[];
}
