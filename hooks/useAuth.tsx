'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation';
import { authService } from '@/services/auth.service';
import type { LoginRequest } from '@/types/auth';
import type { User } from '@/types/user';

interface AuthContextData {
    user: User | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    login: (credentials: LoginRequest) => Promise<void>;
    logout: () => void;
    refetch: () => Promise<void>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const queryClient = useQueryClient();
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const fetchUser = useCallback(async () => {
        if (!authService.isAuthenticated()) {
            setUser(null);
            setIsLoading(false);
            return;
        }

        setIsLoading(true);
        try {
            const userData = await authService.getMe();
            setUser(userData);
        } catch (error) {
            console.error('Failed to fetch user:', error);
            setUser(null);
            authService.logout();
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchUser();
    }, [fetchUser]);

    const login = useCallback(async (credentials: LoginRequest) => {
        setIsLoading(true);
        try {
            await authService.login(credentials);
            await fetchUser();
            router.push('/');
        } catch (error) {
            setIsLoading(false);
            throw error;
        }
    }, [router, fetchUser]);

    const logout = useCallback(() => {
        authService.logout();
        setUser(null);

        queryClient.clear();

        router.push('/login');
    }, [router]);

    const refetch = useCallback(async () => {
        await fetchUser();
    }, [fetchUser]);

    const isAuthenticated = authService.isAuthenticated();

    return (
        <AuthContext.Provider
            value={{
                user,
                isLoading,
                isAuthenticated,
                login,
                logout,
                refetch,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }

    return context;
}