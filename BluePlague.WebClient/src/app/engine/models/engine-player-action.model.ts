import { EngineActionTypeEnum } from './enums/engine-action-type.enum';

export interface EnginePlayerAction {
    type: EngineActionTypeEnum;
    extraIdentifier?: number;
    x: number;
    y: number;
}
