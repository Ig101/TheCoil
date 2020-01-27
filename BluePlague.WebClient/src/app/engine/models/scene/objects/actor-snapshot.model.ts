import { GameObjectSnapshot } from './game-object-snapshot.model';
import { EngineActionTypeEnum } from '../../enums/engine-action-type.enum';
import { ActionTag } from 'src/app/engine/scene/models/action-tag.model';
import { Tag } from 'src/app/engine/scene/models/tag.model';
import { Actor } from 'src/app/engine/scene/objects/actor.object';

export interface ActorSnapshot extends GameObjectSnapshot {
    allowedActions: EngineActionTypeEnum[];
    speedModificator: number;
    maxDurability: number;
    maxEnergy: number;
    passable: boolean;
    tags: Tag<Actor>[];
    actionsTags: ActionTag[];
    durability: number;
    energy: number;
    remainedTurnTime: number;
}
