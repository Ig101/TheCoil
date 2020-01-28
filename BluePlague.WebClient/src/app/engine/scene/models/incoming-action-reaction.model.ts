import { Scene } from '../scene.object';

import { Actor } from '../objects/actor.object';

export interface IncomingActionReaction<T> {
  weight: number;
  reaction: (scene: Scene, object: T, initiator: Actor, time: number, weight?: number, strength?: number) => string[];
}
