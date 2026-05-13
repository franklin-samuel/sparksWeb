'use client';

import React, { useState } from 'react';
import { DashboardLayout } from '@/components/app/Layout';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Loading } from '@/components/ui/Loading';
import { useUsers, useCreateUser, useDeleteUser } from '@/hooks/useUser';
import type { CreateUserRequest, DeleteUserRequest, User } from '@/types/user';

export default function UsersPage() {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);

    const { data: users, isLoading } = useUsers();
    const createMutation = useCreateUser();
    const deleteMutation = useDeleteUser();

    const [createFormData, setCreateFormData] = useState<CreateUserRequest>({
        name: '',
        email: '',
        password: ''
    });

    const [deleteFormData, setDeleteFormData] = useState<DeleteUserRequest>({
        email_confirmation: ''
    });

    const [createErrors, setCreateErrors] = useState<{
        name?: string;
        email?: string;
        password?: string;
    }>({});

    const [deleteError, setDeleteError] = useState<string>('');

    const handleOpenCreateModal = () => {
        setCreateFormData({ name: '', email: '', password: '' });
        setCreateErrors({});
        setIsCreateModalOpen(true);
    };

    const handleCloseCreateModal = () => {
        setIsCreateModalOpen(false);
        setCreateFormData({ name: '', email: '', password: '' });
        setCreateErrors({});
    };

    const handleOpenDeleteModal = (user: User) => {
        setSelectedUser(user);
        setDeleteFormData({ email_confirmation: '' });
        setDeleteError('');
        setIsDeleteModalOpen(true);
    };

    const handleCloseDeleteModal = () => {
        setIsDeleteModalOpen(false);
        setSelectedUser(null);
        setDeleteFormData({ email_confirmation: '' });
        setDeleteError('');
    };

    const validateCreateForm = () => {
        const newErrors: { name?: string; email?: string; password?: string } = {};

        if (!createFormData.name.trim()) {
            newErrors.name = 'Nome é obrigatório';
        } else if (createFormData.name.trim().length < 3) {
            newErrors.name = 'Nome deve ter no mínimo 3 caracteres';
        }

        if (!createFormData.email.trim()) {
            newErrors.email = 'E-mail é obrigatório';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(createFormData.email)) {
            newErrors.email = 'E-mail inválido';
        }

        if (!createFormData.password) {
            newErrors.password = 'Senha é obrigatória';
        } else if (createFormData.password.length < 6) {
            newErrors.password = 'Senha deve ter no mínimo 6 caracteres';
        }

        setCreateErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleCreateSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateCreateForm()) return;

        try {
            await createMutation.mutateAsync(createFormData);
            handleCloseCreateModal();
        } catch (err) {
            console.error(err);
        }
    };

    const handleDeleteSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!selectedUser) return;

        if (!deleteFormData.email_confirmation.trim()) {
            setDeleteError('Confirmação de e-mail é obrigatória');
            return;
        }

        if (deleteFormData.email_confirmation !== selectedUser.email) {
            setDeleteError('O e-mail de confirmação não corresponde');
            return;
        }

        try {
            await deleteMutation.mutateAsync({
                userId: selectedUser.id,
                data: deleteFormData
            });
            handleCloseDeleteModal();
        } catch (err) {
            console.error(err);
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getRoleBadge = (role: 'ADMIN' | 'USER') => {
        if (role === 'ADMIN') {
            return (
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-[#00D4FF]/10 text-[#00D4FF]">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    Administrador
                </div>
            );
        }

        return (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-gray-500/10 text-gray-400">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Usuário
            </div>
        );
    };

    if (isLoading) {
        return (
            <DashboardLayout>
                <Loading.Screen message="Carregando usuários..." />
            </DashboardLayout>
        );
    }

    const adminUsers = users?.filter(user => user.role === 'ADMIN') || [];
    const regularUsers = users?.filter(user => user.role === 'USER') || [];

    return (
        <DashboardLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-2">
                            Gerenciar Usuários
                        </h1>
                        <p className="text-gray-400">
                            Visualize, crie e gerencie os usuários do sistema
                        </p>
                    </div>

                    <Button.Root
                        variant="primary"
                        onClick={handleOpenCreateModal}
                    >
                        <Button.Icon>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                            </svg>
                        </Button.Icon>
                        <Button.Text>Novo Usuário</Button.Text>
                    </Button.Root>
                </div>

                {/* Info Card */}
                <div className="bg-[#00D4FF]/5 border border-[#00D4FF]/20 rounded-xl p-6">
                    <div className="flex gap-4">
                        <div className="flex-shrink-0">
                            <div className="w-10 h-10 bg-[#00D4FF]/10 rounded-lg flex items-center justify-center">
                                <svg className="w-6 h-6 text-[#00D4FF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                        </div>
                        <div>
                            <h3 className="text-white font-semibold mb-1">
                                Sobre os Usuários
                            </h3>
                            <p className="text-gray-400 text-sm leading-relaxed">
                                Esta página é restrita a <strong className="text-white">administradores</strong>.
                                Aqui você pode visualizar todos os usuários cadastrados, criar novos usuários e remover usuários existentes.
                                Administradores têm acesso total ao sistema, enquanto usuários comuns podem apenas gerenciar suas próprias configurações.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-[#16181D] border border-[#252A31] rounded-xl p-6">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 bg-[#00D4FF]/10 rounded-lg flex items-center justify-center">
                                <svg className="w-5 h-5 text-[#00D4FF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-white">{users?.length || 0}</p>
                            </div>
                        </div>
                        <p className="text-sm text-gray-400">Total de Usuários</p>
                    </div>

                    <div className="bg-[#16181D] border border-[#252A31] rounded-xl p-6">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 bg-[#00D4FF]/10 rounded-lg flex items-center justify-center">
                                <svg className="w-5 h-5 text-[#00D4FF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-white">{adminUsers.length}</p>
                            </div>
                        </div>
                        <p className="text-sm text-gray-400">Administradores</p>
                    </div>

                    <div className="bg-[#16181D] border border-[#252A31] rounded-xl p-6">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 bg-gray-500/10 rounded-lg flex items-center justify-center">
                                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-white">{regularUsers.length}</p>
                            </div>
                        </div>
                        <p className="text-sm text-gray-400">Usuários Comuns</p>
                    </div>
                </div>

                <div>
                    <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                        <svg className="w-5 h-5 text-[#00D4FF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                        Administradores ({adminUsers.length})
                    </h2>

                    <div className="grid gap-4">
                        {adminUsers.map((user) => (
                            <div
                                key={user.id}
                                className="bg-[#16181D] border border-[#252A31] rounded-xl p-6 hover:border-[#00D4FF]/30 transition-all duration-200"
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex items-start gap-4 flex-1">
                                        <div className="w-12 h-12 bg-gradient-to-br from-[#00D4FF] to-[#0099CC] rounded-lg flex items-center justify-center flex-shrink-0">
                                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                            </svg>
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <h3 className="text-lg font-semibold text-white mb-1">
                                                {user.name}
                                            </h3>
                                            <p className="text-sm text-gray-400 mb-2">
                                                {user.email}
                                            </p>
                                            <div className="flex items-center gap-3 text-xs text-gray-500">
                                                <div className="flex items-center gap-1.5">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                    </svg>
                                                    Criado em {formatDate(user.created_at)}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        {getRoleBadge(user.role)}

                                        <Button.Root
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleOpenDeleteModal(user)}
                                            className="text-red-400 hover:text-red-300"
                                        >
                                            <Button.Icon>
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                            </Button.Icon>
                                            <Button.Text>Remover</Button.Text>
                                        </Button.Root>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div>
                    <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        Usuários Comuns ({regularUsers.length})
                    </h2>

                    {regularUsers.length === 0 ? (
                        <div className="bg-[#16181D] border border-[#252A31] rounded-xl p-12 text-center">
                            <div className="w-16 h-16 bg-[#252A31] rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                            </div>
                            <p className="text-gray-400">
                                Nenhum usuário comum cadastrado
                            </p>
                        </div>
                    ) : (
                        <div className="grid gap-4">
                            {regularUsers.map((user) => (
                                <div
                                    key={user.id}
                                    className="bg-[#16181D] border border-[#252A31] rounded-xl p-6 hover:border-[#00D4FF]/30 transition-all duration-200"
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-start gap-4 flex-1">
                                            <div className="w-12 h-12 bg-gray-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                                                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                </svg>
                                            </div>

                                            <div className="flex-1 min-w-0">
                                                <h3 className="text-lg font-semibold text-white mb-1">
                                                    {user.name}
                                                </h3>
                                                <p className="text-sm text-gray-400 mb-2">
                                                    {user.email}
                                                </p>
                                                <div className="flex items-center gap-3 text-xs text-gray-500">
                                                    <div className="flex items-center gap-1.5">
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                        </svg>
                                                        Criado em {formatDate(user.created_at)}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            {getRoleBadge(user.role)}

                                            <Button.Root
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleOpenDeleteModal(user)}
                                                className="text-red-400 hover:text-red-300"
                                            >
                                                <Button.Icon>
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                </Button.Icon>
                                                <Button.Text>Remover</Button.Text>
                                            </Button.Root>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <Modal.Root open={isCreateModalOpen} onClose={handleCloseCreateModal} size="md">
                <Modal.Content>
                    <Modal.Header onClose={handleCloseCreateModal}>
                        Criar Novo Usuário
                    </Modal.Header>

                    <form onSubmit={handleCreateSubmit}>
                        <Modal.Body>
                            <Input.Group>
                                <Input.Root
                                    label="Nome Completo"
                                    placeholder="Ex: João Silva"
                                    value={createFormData.name}
                                    onChange={(e) => {
                                        setCreateFormData(prev => ({ ...prev, name: e.target.value }));
                                        if (createErrors.name) setCreateErrors(prev => ({ ...prev, name: undefined }));
                                    }}
                                    error={createErrors.name}
                                    disabled={createMutation.isPending}
                                    autoFocus
                                />

                                <Input.Root
                                    type="email"
                                    label="E-mail"
                                    placeholder="joao@exemplo.com"
                                    value={createFormData.email}
                                    onChange={(e) => {
                                        setCreateFormData(prev => ({ ...prev, email: e.target.value }));
                                        if (createErrors.email) setCreateErrors(prev => ({ ...prev, email: undefined }));
                                    }}
                                    error={createErrors.email}
                                    disabled={createMutation.isPending}
                                />

                                <Input.Root
                                    type="password"
                                    label="Senha"
                                    placeholder="Mínimo 6 caracteres"
                                    value={createFormData.password}
                                    onChange={(e) => {
                                        setCreateFormData(prev => ({ ...prev, password: e.target.value }));
                                        if (createErrors.password) setCreateErrors(prev => ({ ...prev, password: undefined }));
                                    }}
                                    error={createErrors.password}
                                    disabled={createMutation.isPending}
                                />
                            </Input.Group>

                            <div className="mt-4 p-4 bg-[#00D4FF]/5 border border-[#00D4FF]/20 rounded-lg">
                                <p className="text-xs text-[#00D4FF]/80 leading-relaxed">
                                    <strong>Nota:</strong> Os novos usuários são criados com permissões de usuário comum.
                                    Se precisar de permissões de administrador, entre em contato com o suporte.
                                </p>
                            </div>
                        </Modal.Body>

                        <Modal.Footer>
                            <Button.Root
                                variant="ghost"
                                onClick={handleCloseCreateModal}
                                disabled={createMutation.isPending}
                            >
                                <Button.Text>Cancelar</Button.Text>
                            </Button.Root>

                            <Button.Root
                                type="submit"
                                variant="primary"
                                loading={createMutation.isPending}
                            >
                                <Button.Text>Criar Usuário</Button.Text>
                            </Button.Root>
                        </Modal.Footer>
                    </form>
                </Modal.Content>
            </Modal.Root>

            <Modal.Root open={isDeleteModalOpen} onClose={handleCloseDeleteModal} size="md">
                <Modal.Content>
                    <Modal.Header onClose={handleCloseDeleteModal}>
                        Remover Usuário
                    </Modal.Header>

                    <form onSubmit={handleDeleteSubmit}>
                        <Modal.Body>
                            {selectedUser && (
                                <>
                                    <div className="mb-4 p-4 bg-red-500/5 border border-red-500/20 rounded-lg">
                                        <div className="flex gap-3">
                                            <div className="flex-shrink-0">
                                                <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                                </svg>
                                            </div>
                                            <div>
                                                <h4 className="text-red-400 font-semibold mb-1">
                                                    Atenção: Esta ação é irreversível
                                                </h4>
                                                <p className="text-sm text-red-400/80 leading-relaxed">
                                                    Você está prestes a remover permanentemente o usuário <strong>{selectedUser.name}</strong>.
                                                    Todas as configurações e dados associados serão perdidos.
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mb-4 p-4 bg-[#16181D] border border-[#252A31] rounded-lg">
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className="w-10 h-10 bg-gray-500/10 rounded-lg flex items-center justify-center">
                                                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                </svg>
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-white">{selectedUser.name}</p>
                                                <p className="text-xs text-gray-400">{selectedUser.email}</p>
                                            </div>
                                        </div>
                                        {getRoleBadge(selectedUser.role)}
                                    </div>

                                    <Input.Root
                                        type="email"
                                        label="Para confirmar, digite o e-mail do usuário"
                                        placeholder={selectedUser.email}
                                        value={deleteFormData.email_confirmation}
                                        onChange={(e) => {
                                            setDeleteFormData({ email_confirmation: e.target.value });
                                            setDeleteError('');
                                        }}
                                        error={deleteError}
                                        disabled={deleteMutation.isPending}
                                        autoFocus
                                    />
                                </>
                            )}
                        </Modal.Body>

                        <Modal.Footer>
                            <Button.Root
                                variant="ghost"
                                onClick={handleCloseDeleteModal}
                                disabled={deleteMutation.isPending}
                            >
                                <Button.Text>Cancelar</Button.Text>
                            </Button.Root>

                            <Button.Root
                                type="submit"
                                variant="danger"
                                loading={deleteMutation.isPending}
                            >
                                <Button.Text>Remover Usuário</Button.Text>
                            </Button.Root>
                        </Modal.Footer>
                    </form>
                </Modal.Content>
            </Modal.Root>
        </DashboardLayout>
    );
}