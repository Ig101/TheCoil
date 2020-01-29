import { Scene } from '../scene.object';
import { Actor } from '../objects/actor.object';
import { ActorActionResult } from './actor-action-result.model';
import { ActionValidationResult } from './action-validation-result.model';

export interface ActorAction {
  name: string;
  group: string;
  validator?: (scene: Scene, actor: Actor, x: number, y: number, externalIdentifier?: number) => ActionValidationResult;
  action: (scene: Scene, object: Actor, x: number, y: number, externalIdentifier?: number) => ActorActionResult;
}
