import { EnginePlayerActionFull } from 'src/app/engine/models/engine-player-action-full.model';
import { ContextMenuSystemTypesEnum } from './enums/context-menu-system-types.enum';

export interface ContextMenuItem {
  systemType?: ContextMenuSystemTypesEnum;
  action: EnginePlayerActionFull;
  left: number;
  top: number;
  notAvailableReason?: string[];
  warning?: string[];
}
