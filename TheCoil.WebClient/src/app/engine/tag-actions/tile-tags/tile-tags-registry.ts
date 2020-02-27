import { Tag } from '../../scene/models/tag.model';
import { Tile } from '../../scene/tile.object';

export function getTileTagsRegistry(): { [name: string]: Tag<Tile> } {
  return {

  } as { [name: string]: Tag<Tile> };
}
