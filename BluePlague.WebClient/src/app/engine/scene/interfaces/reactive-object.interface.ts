import { EngineActionTypeEnum } from '../../models/enums/engine-action-type.enum';

import { Actor } from '../objects/actor.object';
import { ImpactTag } from '../models/impact-tag.model';

export interface IReactiveObject {
  react(action: EngineActionTypeEnum, initiator: Actor, impactTags?: ImpactTag[], strength?: number);
}
