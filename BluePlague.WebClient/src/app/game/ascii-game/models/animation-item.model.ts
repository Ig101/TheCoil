import { SceneChanges } from 'src/app/engine/models/scene/scene-changes.model';
import { ReactionResult } from 'src/app/engine/scene/models/reaction-result.model';
import { AnimationTileReplacement } from './animation-tile-replacement.model';

export interface AnimationItem {
  snapshotChanges?: SceneChanges;
  message?: ReactionResult;
  overlay?: AnimationTileReplacement[];
}
