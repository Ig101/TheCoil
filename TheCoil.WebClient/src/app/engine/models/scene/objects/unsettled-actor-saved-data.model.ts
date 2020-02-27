import { AnotherLevelLink } from 'src/app/engine/scene/models/another-level-link.model';

export interface UnsettledActorSavedData {
  player: boolean;
  nativeId: string;
  durability: number;
  energy: number;
  position?: AnotherLevelLink;
}
