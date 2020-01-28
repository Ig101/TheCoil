
import { Actor } from '../objects/actor.object';

export interface IReactiveObject {
  react(action: string, initiator: Actor, time: number, strength?: number): string[];
}
