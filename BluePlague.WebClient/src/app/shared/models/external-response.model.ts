export interface ExternalResponse<T> {
    success: boolean;
    statusCode: number;
    errors?: string[];
    result?: T;
}
