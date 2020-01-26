import { Actor } from '../objects/actor.object';
import { Tag } from './tag.model';
import { Scene } from '../scene.object';

export interface ActorTag extends Tag<Actor> {
    selfActionReactions: { [id: number]: (scene: Scene, object: Actor, weight?: number, strength?: number) => never; };
}
