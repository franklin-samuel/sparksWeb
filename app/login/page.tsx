'use client';

import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Loading } from '@/components/ui/Loading';

export default function LoginPage() {
    const { login, isLoading } = useAuth();
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });
    const [errors, setErrors] = useState<{ username?: string; password?: string }>({});
    const [showPassword, setShowPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const validate = () => {
        const newErrors: { username?: string; password?: string } = {};

        if (!formData.username.trim()) {
            newErrors.username = 'E-mail é obrigatório';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.username)) {
            newErrors.username = 'E-mail inválido';
        }

        if (!formData.password) {
            newErrors.password = 'Senha é obrigatória';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Senha deve ter no mínimo 6 caracteres';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validate()) return;

        setIsSubmitting(true);
        try {
            await login(formData);
        } catch (error) {
            console.log(error instanceof Error ? error.message : 'Erro ao fazer login');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleChange = (field: 'username' | 'password') => (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        setFormData(prev => ({ ...prev, [field]: e.target.value }));
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: undefined }));
        }
    };

    if (isLoading) {
        return <Loading.Screen message="Carregando..." />;
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0F1419] bg-grid-pattern p-4 relative overflow-hidden">
            {/* Spark Effects */}
            <div className="absolute top-10 left-10 w-2 h-2 bg-[#00D4FF] rounded-full animate-pulse-spark" />
            <div className="absolute top-32 right-20 w-1.5 h-1.5 bg-[#5CE1FF] rounded-full animate-pulse-spark" style={{ animationDelay: '0.5s' }} />
            <div className="absolute bottom-40 left-1/4 w-1 h-1 bg-[#FFB800] rounded-full animate-pulse-spark" style={{ animationDelay: '1s' }} />
            <div className="absolute bottom-20 right-1/3 w-2 h-2 bg-[#00D4FF] rounded-full animate-pulse-spark" style={{ animationDelay: '1.5s' }} />

            <div className="relative w-full max-w-md z-10">
                <div className="relative bg-[#16181D] border border-[#252A31] rounded-2xl overflow-hidden">
                    {/* Glow Effect */}
                    <div className="absolute -inset-px bg-gradient-to-b from-[#00D4FF]/20 to-transparent rounded-2xl" />

                    <div className="relative p-8">
                        {/* Logo & Header */}
                        <div className="text-center mb-8">
                            {/* Spark Icon */}
                            <div className="flex justify-center mb-4">
                                <div className="relative">
                                    <div className="absolute inset-0 bg-[#00D4FF]/30 blur-xl animate-pulse-spark" />
                                    <div className="relative w-16 h-16 flex items-center justify-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"
                                             className="size-10">
                                            <path fill-rule="evenodd"
                                                  d="M14.615 1.595a.75.75 0 0 1 .359.852L12.982 9.75h7.268a.75.75 0 0 1 .548 1.262l-10.5 11.25a.75.75 0 0 1-1.272-.71l1.992-7.302H3.75a.75.75 0 0 1-.548-1.262l10.5-11.25a.75.75 0 0 1 .913-.143Z"
                                                  clip-rule="evenodd"/>
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">
                                Sparks
                            </h1>
                            <p className="text-sm text-[#00D4FF] font-medium tracking-wide">
                                Link Conversion API
                            </p>
                            <div className="flex items-center justify-center gap-2 mt-3">
                                <div className="h-px w-8 bg-gradient-to-r from-transparent to-[#252A31]" />
                                <div className="w-1 h-1 bg-[#00D4FF] rounded-full" />
                                <div className="h-px w-8 bg-gradient-to-l from-transparent to-[#252A31]" />
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <Input.Group>
                                <Input.Root
                                    type="email"
                                    label="E-mail"
                                    placeholder="seu@email.com"
                                    value={formData.username}
                                    onChange={handleChange('username')}
                                    error={errors.username}
                                    disabled={isSubmitting}
                                    autoComplete="email"
                                />

                                <Input.Wrapper>
                                    <Input.Root
                                        type={showPassword ? 'text' : 'password'}
                                        label="Senha"
                                        placeholder="••••••••"
                                        value={formData.password}
                                        onChange={handleChange('password')}
                                        error={errors.password}
                                        disabled={isSubmitting}
                                        autoComplete="current-password"
                                        className="pr-10"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-0 top-[38px] text-gray-400 hover:text-[#00D4FF] transition-colors"
                                    >
                                        {showPassword ? (
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                            </svg>
                                        ) : (
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                            </svg>
                                        )}
                                    </button>
                                </Input.Wrapper>
                            </Input.Group>

                            <Button.Root
                                type="submit"
                                variant="primary"
                                size="lg"
                                className="w-full mt-6"
                                loading={isSubmitting}
                                disabled={isSubmitting}
                            >
                                {!isSubmitting && (
                                    <Button.Icon>
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                        </svg>
                                    </Button.Icon>
                                )}
                                <Button.Text>
                                    {isSubmitting ? 'Entrando...' : 'Entrar'}
                                </Button.Text>
                            </Button.Root>
                        </form>

                        <div className="mt-6 pt-6 border-t border-[#252A31] text-center">
                            <p className="text-xs text-gray-500">
                                Powered by <span className="text-[#00D4FF] font-medium">Sparks</span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}