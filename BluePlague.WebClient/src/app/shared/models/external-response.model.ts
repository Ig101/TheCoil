export interface ExternalResponse<T> {
    success: boolean;
    errors: string[];
    result: T;
}
