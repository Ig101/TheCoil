import { SpriteNative } from '../../models/natives/sprite-native.model';
import { VisualizationSnapshot } from '../../models/scene/abstract/visualization-snapshot.model';

export class Visualization {

  character: string;
  color: {r: number, g: number, b: number, a: number};
  description: string;

  get snapshot() {
    return {
      character: this.calculatedCharacter,
      color: this.calculatedColor,
      description: this.description
    } as VisualizationSnapshot;
  }

  get calculatedCharacter() {
    return this.character;
  }

  get calculatedColor() {
    return this.color;
  }

  get calculatedDescription() {
    return this.description;
  }

  constructor(native: SpriteNative) {
    this.character = native.character;
    this.color = native.color;
    this.description = native.description;
  }
}
