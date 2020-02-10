import { ActionValidationExtraValue } from './action-validation-extra-value.model';

export interface ActionValidationResult {
  success: boolean;
  warning?: string;
  reason?: string;
  extraValues?: ActionValidationExtraValue[];
}
