import { Scene } from '../scene.object';
import { Actor } from '../objects/actor.object';

export interface SelfActionReaction {
  validator: (scene: Scene, actor: Actor, x: number, y: number) => boolean;
  action: (scene: Scene, object: Actor, x: number, y: number, weight?: number, strength?: number) => number;
}
