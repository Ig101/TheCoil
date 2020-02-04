import { SceneChanges } from 'src/app/engine/models/scene/scene-changes.model';
import { ReactionResult } from 'src/app/engine/scene/models/reaction-result.model';

export interface AnimationItem {
  snapshotChanges?: SceneChanges;
  message?: ReactionResult;
}
