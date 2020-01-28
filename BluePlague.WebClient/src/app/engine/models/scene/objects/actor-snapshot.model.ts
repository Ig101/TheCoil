import { GameObjectSnapshot } from './game-object-snapshot.model';
import { ActionTag } from 'src/app/engine/scene/models/action-tag.model';
import { Tag } from 'src/app/engine/scene/models/tag.model';
import { Actor } from 'src/app/engine/scene/objects/actor.object';
import { ActorAction } from 'src/app/engine/scene/models/actor-action.model';

export interface ActorSnapshot extends GameObjectSnapshot {
    speedModificator: number;
    weight: number;
    maxDurability: number;
    maxEnergy: number;
    passable: boolean;
    tags: ActionTag<Actor>[];
    actions: { [name: string]: ActorAction; };
    durability: number;
    energy: number;
    remainedTurnTime: number;
}
