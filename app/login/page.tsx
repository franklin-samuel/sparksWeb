'use client';

import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Loading } from '@/components/ui/Loading';
import { useToast } from '@/providers/ToastProvider';

export default function LoginPage() {
    const { login, isLoading } = useAuth();
    const { error: showError } = useToast();
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
        <div className="min-h-screen flex items-center justify-center bg-[#0A0A0A] bg-pattern p-4 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-32 bg-white transform -rotate-45 origin-top-left opacity-50" />
            <div className="absolute top-0 left-4 w-1 h-24 bg-white transform -rotate-45 origin-top-left opacity-30" />

            <div className="absolute bottom-0 right-0 w-1 h-32 bg-white transform -rotate-45 origin-bottom-right opacity-50" />
            <div className="absolute bottom-0 right-4 w-1 h-24 bg-white transform -rotate-45 origin-bottom-right opacity-30" />

            <div className="relative w-full max-w-md z-10">
                <div className="absolute -inset-1 bg-white/10 blur-xl animate-glow" />

                <div className="relative bg-[#0A0A0A] border-2 border-white chamfer overflow-hidden">
                    <div className="absolute inset-3 border border-white/20 chamfer-sm pointer-events-none" />

                    <div className="relative p-8">
                        <div className="text-center mb-10">
                            <div className="flex justify-center mb-6">
                                <div className="relative">
                                    <div className="absolute inset-0 bg-white/20 blur-xl" />
                                    <div className="relative w-20 h-20 bg-white flex items-center justify-center chamfer">
                                        <div className="w-16 h-16 bg-[#0A0A0A] flex items-center justify-center chamfer-sm">
                                            <img alt="Logo Computaria" src="logo.png" className="w-20 h-16" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <h1 className="text-4xl mb-3 text-white text-glow">
                                SR. BARRIGA BOT
                            </h1>

                            <p className="text-xs tech-text text-white/60 tracking-widest mb-1">
                                POWERED BY
                            </p>
                            <p className="text-sm tech-text text-[#00D9FF] tracking-widest">
                                COMPUTARIA
                            </p>

                            <div className="flex items-center justify-center gap-2 mt-4">
                                <div className="h-px w-12 bg-white/20" />
                                <div className="w-1 h-1 bg-white/40" />
                                <div className="h-px w-12 bg-white/20" />
                            </div>

                            <p className="text-xs body-text text-white/40 mt-4 tracking-wide">
                                SISTEMA DE LEMBRETES DE PAGAMENTO
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <Input.Group>
                                <Input.Wrapper>
                                    <Input.Root
                                        type="email"
                                        label="E-MAIL"
                                        placeholder="seu@email.com"
                                        value={formData.username}
                                        onChange={handleChange('username')}
                                        error={errors.username}
                                        disabled={isSubmitting}
                                        autoComplete="email"
                                        className="pl-7"
                                    />
                                    <Input.Icon position="left">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                            <path strokeLinecap="square" strokeLinejoin="miter" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                    </Input.Icon>
                                </Input.Wrapper>

                                <Input.Wrapper>
                                    <Input.Root
                                        type={showPassword ? 'text' : 'password'}
                                        label="SENHA"
                                        placeholder="••••••••"
                                        value={formData.password}
                                        onChange={handleChange('password')}
                                        error={errors.password}
                                        disabled={isSubmitting}
                                        autoComplete="current-password"
                                        className="pl-7 pr-7"
                                    />
                                    <Input.Icon position="left">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                            <path strokeLinecap="square" strokeLinejoin="miter" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                        </svg>
                                    </Input.Icon>
                                    <Input.Icon
                                        position="right"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? (
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                                <path strokeLinecap="square" strokeLinejoin="miter" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                            </svg>
                                        ) : (
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                                <path strokeLinecap="square" strokeLinejoin="miter" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                <path strokeLinecap="square" strokeLinejoin="miter" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                            </svg>
                                        )}
                                    </Input.Icon>
                                </Input.Wrapper>
                            </Input.Group>

                            <Button.Root
                                type="submit"
                                variant="primary"
                                size="lg"
                                className="w-full mt-8"
                                loading={isSubmitting}
                                disabled={isSubmitting}
                            >
                                <Button.Icon>
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                                        <path strokeLinecap="square" strokeLinejoin="miter" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                                    </svg>
                                </Button.Icon>
                                <Button.Text>ENTRAR</Button.Text>
                            </Button.Root>
                        </form>

                        <div className="mt-8 pt-6 border-t border-white/10 text-center">
                            <p className="text-xs tech-text text-white/30 tracking-widest">
                                © 2025 COMPUTARIA
                            </p>
                            <p className="text-xs body-text text-white/20 mt-1">
                                &gt;_compilando vitórias
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}