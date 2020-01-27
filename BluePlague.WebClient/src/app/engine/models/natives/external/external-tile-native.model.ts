export interface ExternalTileNative {
  id: string;
  sprite: string;
  backgroundColor: {r: number, g: number, b: number, a: number};
  tags: string[];
  passable: boolean;
}
