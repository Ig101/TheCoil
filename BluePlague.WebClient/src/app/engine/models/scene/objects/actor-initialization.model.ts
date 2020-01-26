import { GameObjectInitialization } from './game-object-initialization.model';
import { ActorNative } from '../../natives/actor-native.model';

export interface ActorInitialization extends GameObjectInitialization {
    native: ActorNative;
}
