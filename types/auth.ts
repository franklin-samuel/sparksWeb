export interface LoginRequest {
    username: string;
    password: string;
}

export interface RefreshTokenRequest {
    refresh_token: string;
}

export interface AuthResponse {
    access_token: string;
    refresh_token: string;
    type: string;
}

export interface AuthTokens {
    accessToken: string;
    refreshToken: string;
    type: string;
}