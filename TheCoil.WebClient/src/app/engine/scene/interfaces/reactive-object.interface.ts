
import { Actor } from '../objects/actor.object';
import { ReactionResult } from '../models/reaction-result.model';

export interface IReactiveObject {
   react(reaction: string, initiator: IReactiveObject, time: number, strength?: number);
   doReactiveAction(animation: string, reaction: string, result: ReactionResult,
                    reachedObjects: IReactiveObject[], time: number, strength: number, range?: number);
}
