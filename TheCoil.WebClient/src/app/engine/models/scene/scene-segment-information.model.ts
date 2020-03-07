import { SceneSegment } from '../../scene/scene-segment.object';

export interface SceneSegmentInformation {
  segmentTiles: { x: number; y: number; }[];
  sceneSegment: SceneSegment;
  previousLoop: boolean;
  nextLoop: boolean;
}
