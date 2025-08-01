export interface Error {
    type: "api" | "validation" | "unknown_api_error" | "unknown_error";
    status?: number; // HTTP status code for API errors
    message: string; // Error message
}