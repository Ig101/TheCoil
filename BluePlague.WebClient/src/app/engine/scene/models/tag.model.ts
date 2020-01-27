import { Scene } from '../scene.object';
import { Actor } from '../objects/actor.object';

export interface Tag<T> {
    name: string;
    interactionTag?: string; // is null, any tag is suitable
    weight?: number;
    targetActionReactions: { [id: number]: (scene: Scene, object: T, initiator: Actor, weight?: number, strength?: number) => void; };
}
