import { RoomTypeEnum } from '../models/enums/room-type.enum';
import { ISceneGenerationFactory } from './scene-generation-factory.interface';
import { RoomSpawnNative } from '../models/natives/room-spawn-native.model';
import { WorldSceneGenerationFactory } from './world-scene-generation.factory';
import { RandomService } from 'src/app/shared/services/random.service';

export function createSceneGenerationFactory(type: RoomTypeEnum, enemiesList: RoomSpawnNative[],
                                             randomService: RandomService): ISceneGenerationFactory {
    switch (type) {
        case RoomTypeEnum.World:
            return new WorldSceneGenerationFactory(enemiesList, randomService);
        default:
            return null;
    }
}
