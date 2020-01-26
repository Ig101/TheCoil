import { RoomSpawnNative } from '../models/natives/room-spawn-native.model';
import { ISceneGenerationFactory } from './scene-generation-factory.interface';
import { SceneInitialization } from '../models/scene/scene-initialization.model';
import { RandomService } from 'src/app/shared/services/random.service';

export class WorldSceneGenerationFactory implements ISceneGenerationFactory {

    constructor(
        private enemiesList: RoomSpawnNative[],
        private randomService: RandomService
        ) {
    }

    generate(): SceneInitialization {
        throw new Error('Method not implemented.');
    }
}
