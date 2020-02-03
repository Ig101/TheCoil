export interface ActionValidationResult {
  success: boolean;
  warning?: string[];
  reason?: string[];
  extraValues?: number[];
}
