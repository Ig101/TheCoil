import { ReactionResult } from './reaction-result.model';

export interface ActionValidationResult {
  success: boolean;
  warning?: string[];
  reason?: string[];
  extraValues?: number[];
}
