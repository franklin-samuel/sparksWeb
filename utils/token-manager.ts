import Cookies from 'js-cookie';

const ACCESS_TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';

export const tokenManager = {
    getAccessToken: (): string | undefined => {
        return Cookies.get(ACCESS_TOKEN_KEY);
    },

    getRefreshToken: (): string | undefined => {
        return Cookies.get(REFRESH_TOKEN_KEY);
    },

    setTokens: (accessToken: string, refreshToken: string): void => {
        Cookies.set(ACCESS_TOKEN_KEY, accessToken, { expires: 7 });
        Cookies.set(REFRESH_TOKEN_KEY, refreshToken, { expires: 7 });
    },

    clearTokens: (): void => {
        Cookies.remove(ACCESS_TOKEN_KEY);
        Cookies.remove(REFRESH_TOKEN_KEY);
    },

    hasTokens: (): boolean => {
        return !!(tokenManager.getAccessToken() && tokenManager.getRefreshToken());
    },
};