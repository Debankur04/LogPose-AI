// A unified API client for the entire frontend

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

export async function apiClient(endpoint, options = {}) {
    let token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;
    
    const headers = {
        "Content-Type": "application/json",
        ...options.headers,
    };

    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }

    const config = {
        ...options,
        headers,
    };

    let response = await fetch(`${API_URL}${endpoint}`, config);

    // Provide automatic token refresh mechanism if returning 401 Unauthorized
    if (response.status === 401) {
        const refreshToken = typeof window !== "undefined" ? localStorage.getItem("refresh_token") : null;
        
        if (refreshToken) {
            try {
                // Try to get a new access token
                const refreshResponse = await fetch(`${API_URL}/refresh`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ refresh_token: refreshToken })
                });

                if (refreshResponse.ok) {
                    const data = await refreshResponse.json();
                    if (data.access_token) {
                        localStorage.setItem("access_token", data.access_token);
                        localStorage.setItem("refresh_token", data.refresh_token);
                        localStorage.setItem("user_id", data.user_id);
                        
                        // Retry original request with new token
                        headers["Authorization"] = `Bearer ${data.access_token}`;
                        response = await fetch(`${API_URL}${endpoint}`, { ...options, headers });
                    }
                } else {
                    // Refresh failed (e.g. token expired/invalid) - Force logout
                    localStorage.clear();
                    if (typeof window !== "undefined") window.location.href = "/login";
                }
            } catch (err) {
                 localStorage.clear();
                 if (typeof window !== "undefined") window.location.href = "/login";
            }
        } else {
             // No refresh token available - Force logout
             localStorage.clear();
             if (typeof window !== "undefined") window.location.href = "/login";
        }
    }

    return response;
}
