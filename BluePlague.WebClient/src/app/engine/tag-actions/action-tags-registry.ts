import { ActionTag } from '../scene/models/action-tag.model';
import { EngineActionTypeEnum } from '../models/enums/engine-action-type.enum';
import { OutgoingActionReaction } from '../scene/models/outgoing-action-reaction.model';
import { movableMoveValidation, movableMoveOutgoing } from './movable.actions';
import { waitableWaitOutgoing } from './waitable.actions';
import { cryOnWaitWaitOutgoing } from './cry-on-wait.actions';

export function getActionTagsRegistry(): { [name: string]: ActionTag } {
  const registry: { [name: string]: ActionTag } = {};

  // movable
  const movableReactions = {};
  movableReactions[EngineActionTypeEnum.Move] = {
    validator: movableMoveValidation,
    action: movableMoveOutgoing
  };
  registry.movable = {
    name: 'movable',
    reactions: movableReactions
  };

  // waitable
  const waitableReactions = {};
  waitableReactions[EngineActionTypeEnum.Wait] = {
    action: waitableWaitOutgoing
  };
  registry.waitable = {
    name: 'waitable',
    reactions: waitableReactions
  };

  // cryOnWait
  const cryOnWaitReactions = {};
  cryOnWaitReactions[EngineActionTypeEnum.Wait] = {
    action: cryOnWaitWaitOutgoing
  };
  registry.cryOnWait = {
    name: 'cryOnWait',
    reactions: cryOnWaitReactions
  };

  return registry;
}
