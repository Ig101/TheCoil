
import { Actor } from '../objects/actor.object';
import { ImpactTag } from '../models/impact-tag.model';

export interface IReactiveObject {
  react(action: string, initiator: Actor, time: number, impactTags?: ImpactTag[]): string[];
}
