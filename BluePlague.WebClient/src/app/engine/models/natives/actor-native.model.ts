import { SpriteNative } from './sprite-native.model';
import { EngineActionTypeEnum } from '../enums/engine-action-type.enum';
import { ActionTag } from '../../scene/models/action-tag.model';
import { Actor } from '../../scene/objects/actor.object';
import { Tag } from '../../scene/models/tag.model';

export interface ActorNative {
    id: string;
    sprite: SpriteNative;
    allowedActions: EngineActionTypeEnum[];
    speedModificator: number;
    maxDurability: number;
    maxEnergy: number;
    tags: Tag<Actor>[];
    actionTags: ActionTag[];
    passable: boolean;
}
