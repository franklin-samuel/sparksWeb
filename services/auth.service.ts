import { httpClient } from '@/utils/http-client';
import { tokenManager } from '@/utils/token-manager';
import type {
    LoginRequest,
    AuthResponse,
    RefreshTokenRequest,
} from '@/types/auth';
import type { User } from '@/types/user';

export const authService = {
    login: async (credentials: LoginRequest): Promise<AuthResponse> => {
        const response = await httpClient.post<AuthResponse>(
            '/auth/login',
            credentials,
            { skipAuth: true }
        );

        if (response.data) {
            tokenManager.setTokens(
                response.data.access_token,
                response.data.refresh_token
            );
        }

        return response.data!;
    },

    refreshToken: async (): Promise<AuthResponse> => {
        const refreshToken = tokenManager.getRefreshToken();
        if (!refreshToken) {
            throw new Error('No refresh token available');
        }

        const payload: RefreshTokenRequest = {
            refresh_token: refreshToken,
        };

        const response = await httpClient.post<AuthResponse>(
            '/auth/refresh',
            payload,
            { skipAuth: true }
        );

        if (response.data) {
            tokenManager.setTokens(
                response.data.access_token,
                response.data.refresh_token
            );
        }

        return response.data!;
    },

    getMe: async (): Promise<User> => {
        const response = await httpClient.get<User>('/me');
        return response.data!;
    },

    logout: (): void => {
        tokenManager.clearTokens();
    },

    isAuthenticated: (): boolean => {
        return tokenManager.hasTokens();
    },
};