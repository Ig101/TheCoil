
export interface ExternalActorNative {
  id: string;
  sprite: string;
  speedModificator: number;
  maxDurability: number;
  maxEnergy: number;
  tags: string[];
  actions: string[];
  passable: boolean;
}
