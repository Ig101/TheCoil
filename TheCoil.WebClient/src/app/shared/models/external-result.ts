export interface ExternalResult<T> {
  success: boolean;
  result?: T;
  errors?: string[];
}
