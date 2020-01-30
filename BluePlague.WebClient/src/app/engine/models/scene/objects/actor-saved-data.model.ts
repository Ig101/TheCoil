import { GameObjectSavedData } from './game-object-saved-data.model';

export interface ActorSavedData extends GameObjectSavedData {
    player: boolean;
    nativeId: string;
    durability: number;
    energy: number;
    remainedTurnTime: number;
}

