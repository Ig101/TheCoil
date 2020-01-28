import { SpriteNative } from './sprite-native.model';
import { ActionTag } from '../../scene/models/action-tag.model';
import { Actor } from '../../scene/objects/actor.object';
import { Tag } from '../../scene/models/tag.model';
import { ActorAction } from '../../scene/models/actor-action.model';

export interface ActorNative {
    id: string;
    name: string;
    sprite: SpriteNative;
    speedModificator: number;
    weight: number;
    maxDurability: number;
    maxEnergy: number;
    tags: ActionTag<Actor>[];
    actions: ActorAction[];
    passable: boolean;
}
