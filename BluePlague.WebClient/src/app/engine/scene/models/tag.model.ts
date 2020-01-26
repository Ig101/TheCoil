import { Scene } from '../scene.object';
import { Actor } from '../objects/actor.object';

export interface Tag<T> {
    name: string;
    interactionTags?: string[]; // is null, any tag is suitable
    weight?: number;
    targetActionReactions: { [id: number]: (scene: Scene, object: T, weight?: number, strength?: number) => never; };
}
