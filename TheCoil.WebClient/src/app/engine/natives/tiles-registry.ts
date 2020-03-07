import { NativeService } from '../services/native.service';
import { Tag } from '../scene/models/tag.model';
import { Tile } from '../scene/tile.object';

export function getTilesRegistry(
  tileTags: { [tag: string]: Tag<Tile>; }
) {
  return {
    stoneWall: {
      id: 'stoneWall',
      name: $localize`:@@game.tile.stoneWall:Stone wall`,
      sprite: {
        character: '#',
        description: '-',
        color: {r: 220, g: 220, b: 220, a: 0.8}
      },
      backgroundColor: {r: 30, g: 30, b: 30},
      bright: false,
      tags: [],
      passable: false,
      viewable: false
    },
    stone: {
      id: 'stone',
      name: $localize`:@@game.tile.stone:Stone`,
      sprite: {
        character: '.',
        description: '-',
        color: {r: 120, g: 120, b: 120, a: 1}
      },
      backgroundColor: {r: 30, g: 30, b: 30},
      bright: false,
      tags: [],
      passable: true,
      viewable: true
    },
    grass: {
      id: 'grass',
      name: $localize`:@@game.tile.grass:Grass`,
      sprite: {
        character: '-',
        description: '-',
        color: {r: 0, g: 250, b: 0, a: 0.8}
      },
      backgroundColor: {r: 0, g: 35, b: 0},
      bright: false,
      tags: [],
      passable: true,
      viewable: true
    },
    sand: {
      id: 'sand',
      name: $localize`:@@game.tile.sand:Sand`,
      sprite: {
        character: '.',
        description: '-',
        color: {r: 244, g: 164, b: 96, a: 0.8}
      },
      backgroundColor: {r: 30, g: 20, b: 10},
      bright: false,
      tags: [],
      passable: true,
      viewable: true
    },
  };
}

