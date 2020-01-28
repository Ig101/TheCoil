
export interface ExternalActorNative {
  id: string;
  sprite: string;
  speedModificator: number;
  maxDurability: number;
  maxEnergy: number;
  tags: { name: string, weight?: number }[];
  actions: string[];
  passable: boolean;
}
