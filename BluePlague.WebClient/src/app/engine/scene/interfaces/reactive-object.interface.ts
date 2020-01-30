
import { Actor } from '../objects/actor.object';
import { ReactionResult } from '../models/reaction-result.model';

export interface IReactiveObject {
   react(action: string, initiator: Actor, time: number, strength?: number): ReactionResult[];
}
