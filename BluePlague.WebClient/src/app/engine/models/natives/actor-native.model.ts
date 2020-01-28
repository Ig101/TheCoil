import { SpriteNative } from './sprite-native.model';
import { ActorTag } from '../../scene/models/actor-tag.model';
import { Actor } from '../../scene/objects/actor.object';
import { Tag } from '../../scene/models/tag.model';
import { ActorAction } from '../../scene/models/actor-action.model';

export interface ActorNative {
    id: string;
    name: string;
    sprite: SpriteNative;
    speedModificator: number;
    maxDurability: number;
    maxEnergy: number;
    tags: ActorTag[];
    actions: { [name: string]: ActorAction; };
    passable: boolean;
}
