import { EngineActionTypeEnum } from '../../enums/engine-action-type.enum';

export interface ExternalActorNative {
  id: string;
  sprite: string;
  allowedActions: EngineActionTypeEnum[];
  speedModificator: number;
  maxDurability: number;
  maxEnergy: number;
  tags: string[];
  actionTags: string[];
  passable: boolean;
}
