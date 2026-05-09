import { tokenManager } from './token-manager';
import type { ApiResponse } from '@/types/api';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

interface RequestConfig extends RequestInit {
    skipAuth?: boolean;
    skipToast?: boolean;
}

let toastCallback: ((message: string, type: 'success' | 'error') => void) | null = null;

export const setToastCallback = (callback: (message: string, type: 'success' | 'error') => void) => {
    toastCallback = callback;
};

class HttpClient {
    private isRefreshing = false;
    private refreshSubscribers: ((token: string) => void)[] = [];

    private subscribeTokenRefresh(callback: (token: string) => void) {
        this.refreshSubscribers.push(callback);
    }

    private onTokenRefreshed(token: string) {
        this.refreshSubscribers.forEach((callback) => callback(token));
        this.refreshSubscribers = [];
    }

    private async refreshToken(): Promise<string | null> {
        const refreshToken = tokenManager.getRefreshToken();
        if (!refreshToken) {
            return null;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ refresh_token: refreshToken }),
            });

            if (!response.ok) {
                throw new Error('Failed to refresh token');
            }

            const data = await response.json();
            const { access_token, refresh_token } = data.data;

            tokenManager.setTokens(access_token, refresh_token);
            return access_token;
        } catch (error) {
            tokenManager.clearTokens();
            window.location.href = '/login';
            return null;
        }
    }

    private async request<T>(
        endpoint: string,
        config: RequestConfig = {}
    ): Promise<ApiResponse<T>> {
        const { skipAuth = false, skipToast = false, headers = {}, ...restConfig } = config;

        const url = `${API_BASE_URL}${endpoint}`;
        const accessToken = tokenManager.getAccessToken();

        const requestHeaders = new Headers(headers as HeadersInit);

        if (!requestHeaders.has('Content-Type')) {
            requestHeaders.set('Content-Type', 'application/json');
        }

        if (!skipAuth && accessToken) {
            requestHeaders.set('Authorization', `Bearer ${accessToken}`);
        }

        try {
            const response = await fetch(url, {
                ...restConfig,
                headers: requestHeaders,
            });

            // Token expirado - tentar refresh
            if (response.status === 401 && !skipAuth) {
                if (!this.isRefreshing) {
                    this.isRefreshing = true;
                    const newToken = await this.refreshToken();
                    this.isRefreshing = false;

                    if (newToken) {
                        this.onTokenRefreshed(newToken);
                        return this.request<T>(endpoint, config);
                    }
                } else {
                    return new Promise((resolve) => {
                        this.subscribeTokenRefresh(() => {
                            resolve(this.request<T>(endpoint, config));
                        });
                    });
                }
            }

            const data: ApiResponse<T> = await response.json();

            if (!response.ok) {
                const errorMessage = data.error || 'Ocorreu um erro inesperado';

                if (!skipToast && toastCallback) {
                    toastCallback(errorMessage, 'error');
                }

                const error = new Error(errorMessage);
                (error as any).isHandled = true;
                throw error;
            }

            if (!skipToast && data.message && toastCallback && restConfig.method !== 'GET') {
                toastCallback(data.message, 'success');
            }

            return data;
        } catch (error) {
            if (!skipToast && toastCallback && error instanceof Error && !(error as any).isHandled) {
                toastCallback('Erro de conexão. Tente novamente.', 'error');
            }
            throw error;
        }
    }

    async get<T>(endpoint: string, config?: RequestConfig): Promise<ApiResponse<T>> {
        return this.request<T>(endpoint, { ...config, method: 'GET', skipToast: true });
    }

    async post<T>(
        endpoint: string,
        body?: unknown,
        config?: RequestConfig
    ): Promise<ApiResponse<T>> {
        return this.request<T>(endpoint, {
            ...config,
            method: 'POST',
            body: body ? JSON.stringify(body) : undefined,
        });
    }

    async patch<T>(
        endpoint: string,
        body?: unknown,
        config?: RequestConfig
    ): Promise<ApiResponse<T>> {
        return this.request<T>(endpoint, {
            ...config,
            method: 'PATCH',
            body: body ? JSON.stringify(body) : undefined,
        });
    }

    async put<T>(
        endpoint: string,
        body?: unknown,
        config?: RequestConfig
    ): Promise<ApiResponse<T>> {
        return this.request<T>(endpoint, {
            ...config,
            method: 'PUT',
            body: body ? JSON.stringify(body) : undefined,
        });
    }

    async delete<T>(endpoint: string, config?: RequestConfig): Promise<ApiResponse<T>> {
        return this.request<T>(endpoint, { ...config, method: 'DELETE' });
    }
}

export const httpClient = new HttpClient();