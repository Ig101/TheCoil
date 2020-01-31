
import { Actor } from '../objects/actor.object';
import { ReactionResult } from '../models/reaction-result.model';

export interface IReactiveObject {
   react(action: string, initiator: IReactiveObject, time: number, strength?: number);
   doReactiveAction(type: string, group: string, reaction: ReactionResult,
                    reachedObjects: IReactiveObject[], time: number, strength: number);
}
