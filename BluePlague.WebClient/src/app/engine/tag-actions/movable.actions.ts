import { ActionResult } from '../scene/models/action-result.model';
import { Scene } from '../scene/scene.object';
import { Actor } from '../scene/objects/actor.object';

export function movableMoveOutgoing(scene: Scene, object: Actor, x: number, y: number,
                                    weight: number = 1, strength?: number): ActionResult {
  const timeShift = object.calculatedSpeedModification * weight;
  const tile = scene.getTile(x, y);
  object.changePositionToTile(tile);
  return {
    time: timeShift,
    message: null
  } as ActionResult;
}

export function movableMoveValidation(scene: Scene, actor: Actor, x: number, y: number): boolean {
  if (this.remainedTurnTime > 0 || x - actor.x > 1 || y - actor.y > 1 || x - actor.x < -1 || y - actor.y < -1) {
    return false;
  }
  const tile = this.parent.getTile(x, y);
  if (!tile.passable || tile.objects.filter(o => (o instanceof Actor && !o.passable)).length > 0) {
      return false;
  }
  return true;
}
