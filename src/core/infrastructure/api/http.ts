const headers = {
    "Content-Type": "application/json",
    };
    
    const handleResponse = async <T>(response: Response): Promise<T> => {
        if (!response.ok) {
        const error = await response.text();
        throw new Error(`HTTP Error: ${response.status} - ${error}`);
        }
        return response.json() as Promise<T>;
    };
    
    const get = async <T>(url: string): Promise<T> => {
        const response = await fetch(url, { method: "GET", headers });
        return handleResponse<T>(response);
    };
    
    const post = async <T>(url: string, body: unknown): Promise<T> => {
        const response = await fetch(url, {
        method: "POST",
        headers,
        body: JSON.stringify(body),
        });
        return handleResponse<T>(response);
    };
    
    const put = async <T>(url: string, body: unknown): Promise<T> => {
        const response = await fetch(url, {
        method: "PUT",
        headers,
        body: JSON.stringify(body),
        });
        return handleResponse<T>(response);
    };
    
    const _delete = async <T>(url: string): Promise<T | void> => {
        const response = await fetch(url, { method: "DELETE", headers });
    
        // Algunas APIs no devuelven JSON en DELETE
        return response.status !== 204 ? handleResponse<T>(response) : undefined;
    };
    
    export const http = {
        get,
        post,
        put,
        delete: _delete,
    };
    