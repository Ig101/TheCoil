import { ActorSavedData } from './scene/objects/actor-saved-data.model';
import { GameStateEnum } from './enums/game-state.enum';

export interface MetaInformation {
  session: string;
  incrementor: number;
  height: number;
  width: number;
  turn: number;
  gameState: GameStateEnum;
}
