export interface ExternalTileNative {
  id: string;
  name: string;
  sprite: string;
  backgroundColor: {r: number, g: number, b: number};
  bright: boolean;
  tags: { name: string, weight?: number }[];
  passable: boolean;
}
