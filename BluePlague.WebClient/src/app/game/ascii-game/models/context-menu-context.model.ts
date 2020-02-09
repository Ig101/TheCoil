import { ActionValidationResultFull } from 'src/app/engine/scene/models/action-validation-result-full.model';

export interface ContextMenuContext {
  targetName: string;
  actions: ActionValidationResultFull[];
}
