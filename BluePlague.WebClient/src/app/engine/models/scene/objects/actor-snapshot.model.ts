import { GameObjectSnapshot } from './game-object-snapshot.model';
import { EngineActionTypeEnum } from '../../enums/engine-action-type.enum';
import { ActorTag } from 'src/app/engine/scene/models/actor-tag.model';

export interface ActorSnapshot extends GameObjectSnapshot {
    allowedActions: EngineActionTypeEnum[];
    speedModificator: number;
    maxDurability: number;
    maxEnergy: number;
    passable: boolean;
    tags: ActorTag[];
    durability: number;
    energy: number;
    remainedTurnTime: number;
}
