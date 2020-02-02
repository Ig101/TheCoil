import { ActionParsingResult } from 'src/app/engine/scene/models/action-parsing-result.model';

export interface ContextMenu {
  actions: {[id: string]: ActionParsingResult; };
}
