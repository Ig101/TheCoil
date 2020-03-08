import { ActorSavedData } from './scene/objects/actor-saved-data.model';

export interface PlayerSavedData {
  actor: ActorSavedData;
  scene: number;
}
