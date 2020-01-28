import { GameObjectSnapshot } from './game-object-snapshot.model';
import { ActorTag } from 'src/app/engine/scene/models/actor-tag.model';
import { Tag } from 'src/app/engine/scene/models/tag.model';
import { Actor } from 'src/app/engine/scene/objects/actor.object';
import { ActorAction } from 'src/app/engine/scene/models/actor-action.model';

export interface ActorSnapshot extends GameObjectSnapshot {
    speedModificator: number;
    maxDurability: number;
    maxEnergy: number;
    passable: boolean;
    tags: ActorTag[];
    actions: { [name: string]: ActorAction; };
    durability: number;
    energy: number;
    remainedTurnTime: number;
}
