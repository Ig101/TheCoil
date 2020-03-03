import { GameStateSavedData } from './game-state-saved-data.model';
import { PlayerSavedData } from './player-saved-data.model';
import { MetaInformation } from './meta-information.model';

export interface FullGameStateSavedData extends GameStateSavedData {
  player: PlayerSavedData;
  metaInformation: MetaInformation;
}
