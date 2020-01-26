import { SceneInitialization } from '../models/scene/scene-initialization.model';

export interface ISceneGenerationFactory {
    generate(): SceneInitialization;
}
