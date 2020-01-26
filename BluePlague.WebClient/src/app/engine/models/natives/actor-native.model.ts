import { SpriteNative } from './sprite-native.model';
import { EngineActionTypeEnum } from '../enums/engine-action-type.enum';
import { ActorTag } from '../../scene/models/actor-tag.model';

export interface ActorNative {
    id: string;
    sprite: SpriteNative;
    allowedActions: EngineActionTypeEnum[];
    speedModificator: number;
    maxDurability: number;
    maxEnergy: number;
    tags: ActorTag[];
    passable: boolean;
}
