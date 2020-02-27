import { ActionTag } from 'src/app/engine/scene/models/action-tag.model';
import { Tag } from 'src/app/engine/scene/models/tag.model';
import { Actor } from 'src/app/engine/scene/objects/actor.object';
import { ActorAction } from 'src/app/engine/scene/models/actor-action.model';
import { VisualizationSnapshot } from '../abstract/visualization-snapshot.model';

export interface ActorSnapshot {
    id: number;
    x: number;
    y: number;
    name: string;
    passable: boolean;
    sprite: VisualizationSnapshot;
    speedModificator: number;
    weight: number;
    maxDurability: number;
    maxEnergy: number;
    tags: ActionTag<Actor>[];
    actions: ActorAction[];
    durability: number;
    energy: number;
    remainedTurnTime: number;
}
