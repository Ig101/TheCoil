import { EngineActionTypeEnum } from '../../models/enums/engine-action-type.enum';

import { Actor } from '../objects/actor.object';
import { ImpactTag } from '../models/impact-tag.model';
import { ActionResult } from '../models/action-result.model';

export interface IReactiveObject {
  react(action: EngineActionTypeEnum, initiator: Actor, time: number, impactTags?: ImpactTag[], strength?: number): ActionResult[];
}
