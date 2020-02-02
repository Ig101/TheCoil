import { ActionParsingResult } from 'src/app/engine/scene/models/action-parsing-result.model';

export interface ContextMenuContext {
  targetX: number;
  targetY: number;
  actions: ActionParsingResult[];
}
