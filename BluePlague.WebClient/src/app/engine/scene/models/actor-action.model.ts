import { Scene } from '../scene.object';
import { Actor } from '../objects/actor.object';
import { ActorActionResult } from './actor-action-result.model';

export interface ActorAction {
  name: string;
  group: string;
  validator?: (scene: Scene, actor: Actor, x: number, y: number, externalIdentifier?: number) => boolean;
  action: (scene: Scene, object: Actor, x: number, y: number, externalIdentifier?: number) => ActorActionResult;
}
