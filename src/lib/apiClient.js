// A unified API client for the entire frontend

import { clearAuthSession, getAuthSession, persistAuthSession, supabase } from "@/lib/supabaseClient";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

const redirectToLogin = async () => {
    await clearAuthSession();
    if (typeof window !== "undefined") window.location.href = "/login";
};

const retryWithToken = (endpoint, options, token) => {
    const headers = {
        "Content-Type": "application/json",
        ...options.headers,
        Authorization: `Bearer ${token}`,
    };

    return fetch(`${API_URL}${endpoint}`, { ...options, headers });
};

export async function apiClient(endpoint, options = {}) {
    const session = await getAuthSession();
    let token = session?.accessToken || null;
    
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
        const refreshToken = session?.refreshToken || (typeof window !== "undefined" ? localStorage.getItem("refresh_token") : null);
        
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
                        persistAuthSession({
                            access_token: data.access_token,
                            refresh_token: data.refresh_token,
                            user_id: data.user_id,
                            user_email: typeof window !== "undefined" ? localStorage.getItem("user_email") : "",
                        });
                        
                        // Retry original request with new token
                        response = await retryWithToken(endpoint, options, data.access_token);
                    }
                } else {
                    const { data, error } = await supabase.auth.refreshSession({ refresh_token: refreshToken });

                    if (!error && data?.session?.access_token) {
                        const refreshed = persistAuthSession(data.session);
                        response = await retryWithToken(endpoint, options, refreshed.accessToken);
                    } else {
                        // Refresh failed (e.g. token expired/invalid) - Force logout
                        await redirectToLogin();
                    }
                }
            } catch (err) {
                 await redirectToLogin();
            }
        } else {
             // No refresh token available - Force logout
             await redirectToLogin();
        }
    }

    return response;
}
