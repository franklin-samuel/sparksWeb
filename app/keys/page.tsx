'use client';

import React, { useState } from 'react';
import { DashboardLayout } from '@/components/app/Layout';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Loading } from '@/components/ui/Loading';
import { useApiKeys, useCreateApiKey, useRevokeApiKey } from '@/hooks/useApiKey';
import { ApiKeyStatus, type CreateApiKeyResponse } from '@/types/api-key';

export default function ApiKeysPage() {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isRevokeModalOpen, setIsRevokeModalOpen] = useState(false);
    const [selectedKeyId, setSelectedKeyId] = useState<string | null>(null);
    const [selectedKeyName, setSelectedKeyName] = useState<string>('');
    const [createdKey, setCreatedKey] = useState<CreateApiKeyResponse | null>(null);
    const [isKeyModalOpen, setIsKeyModalOpen] = useState(false);

    const { data: apiKeys, isLoading } = useApiKeys();
    const createMutation = useCreateApiKey();
    const revokeMutation = useRevokeApiKey();

    const [formData, setFormData] = useState({
        name: ''
    });

    const [errors, setErrors] = useState<{ name?: string }>({});

    const handleOpenCreateModal = () => {
        setFormData({ name: '' });
        setErrors({});
        setIsCreateModalOpen(true);
    };

    const handleCloseCreateModal = () => {
        setIsCreateModalOpen(false);
        setFormData({ name: '' });
        setErrors({});
    };

    const validate = () => {
        const newErrors: { name?: string } = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Nome é obrigatório';
        } else if (formData.name.trim().length < 3) {
            newErrors.name = 'Nome deve ter no mínimo 3 caracteres';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validate()) return;

        try {
            const result = await createMutation.mutateAsync({ name: formData.name.trim() });
            setCreatedKey(result);
            handleCloseCreateModal();
            setIsKeyModalOpen(true);
        } catch (err) {
            console.error(err);
        }
    };

    const handleOpenRevokeModal = (keyId: string, keyName: string) => {
        setSelectedKeyId(keyId);
        setSelectedKeyName(keyName);
        setIsRevokeModalOpen(true);
    };

    const handleCloseRevokeModal = () => {
        setIsRevokeModalOpen(false);
        setSelectedKeyId(null);
        setSelectedKeyName('');
    };

    const handleRevoke = async () => {
        if (!selectedKeyId) return;

        try {
            await revokeMutation.mutateAsync(selectedKeyId);
            handleCloseRevokeModal();
        } catch (err) {
            console.error(err);
        }
    };

    const handleCopyKey = () => {
        if (createdKey?.plainKey) {
            navigator.clipboard.writeText(createdKey.plainKey);
        }
    };

    const handleCloseKeyModal = () => {
        setIsKeyModalOpen(false);
        setCreatedKey(null);
    };

    const formatDate = (dateString: string | null) => {
        if (!dateString) return 'Nunca';
        return new Date(dateString).toLocaleString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (isLoading) {
        return (
            <DashboardLayout>
                <Loading.Screen message="Carregando API Keys..." />
            </DashboardLayout>
        );
    }

    const activeKeys = apiKeys?.filter(key => key.status === ApiKeyStatus.ACTIVE) || [];
    const revokedKeys = apiKeys?.filter(key => key.status === ApiKeyStatus.REVOKED) || [];

    return (
        <DashboardLayout>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-2">
                            API Keys
                        </h1>
                        <p className="text-gray-400">
                            Gerencie suas chaves de autenticação para acesso à API
                        </p>
                    </div>

                    <Button.Root
                        variant="primary"
                        onClick={handleOpenCreateModal}
                    >
                        <Button.Icon>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                        </Button.Icon>
                        <Button.Text>Nova API Key</Button.Text>
                    </Button.Root>
                </div>

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
                                Como usar sua API Key
                            </h3>
                            <p className="text-gray-400 text-sm leading-relaxed mb-3">
                                Use a API Key no header <code className="px-2 py-0.5 bg-[#0F1419] rounded text-[#00D4FF] font-mono text-xs">Authorization: Bearer sk_live_xxxxx</code> para autenticar suas requisições.
                            </p>
                            <div className="bg-[#0F1419] rounded-lg p-3 font-mono text-xs text-gray-300 border border-[#252A31]">
                                <span className="text-gray-500">curl</span> -X POST https://sparks-zxjn.onrender.com/api/convert \<br />
                                <span className="ml-4 text-gray-500">-H</span> <span className="text-green-400">"Authorization: Bearer sk_live_..."</span> \<br />
                                <span className="ml-4 text-gray-500">-H</span> <span className="text-green-400">"Content-Type: application/json"</span> \<br />
                                <span className="ml-4 text-gray-500">-d</span> <span className="text-yellow-400">'{"{"}"urls": ["..."]{"}"}'</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div>
                    <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full" />
                        Ativas ({activeKeys.length})
                    </h2>

                    {activeKeys.length === 0 ? (
                        <div className="bg-[#16181D] border border-[#252A31] rounded-xl p-12 text-center">
                            <div className="w-16 h-16 bg-[#252A31] rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                                </svg>
                            </div>
                            <p className="text-gray-400">
                                Você ainda não criou nenhuma API Key
                            </p>
                            <Button.Root
                                variant="secondary"
                                className="mt-4"
                                onClick={handleOpenCreateModal}
                            >
                                <Button.Icon>
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                    </svg>
                                </Button.Icon>
                                <Button.Text>Criar primeira API Key</Button.Text>
                            </Button.Root>
                        </div>
                    ) : (
                        <div className="grid gap-4">
                            {activeKeys.map((key) => (
                                <div
                                    key={key.id}
                                    className="bg-[#16181D] border border-[#252A31] rounded-xl p-6 hover:border-[#00D4FF]/30 transition-all duration-200"
                                >
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-start gap-4 flex-1">
                                            <div className="w-12 h-12 bg-[#00D4FF]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                                                <svg className="w-6 h-6 text-[#00D4FF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                                                </svg>
                                            </div>

                                            <div className="flex-1 min-w-0">
                                                <h3 className="text-lg font-semibold text-white mb-1">
                                                    {key.name}
                                                </h3>
                                                <div className="flex items-center gap-3 text-sm text-gray-400">
                                                    <span className="font-mono">{key.keyPrefix}...</span>
                                                    <span>•</span>
                                                    <span>Criada em {formatDate(key.createdAt)}</span>
                                                </div>
                                                {key.lastUsedAt && (
                                                    <div className="mt-2 flex items-center gap-2 text-xs text-gray-500">
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                        </svg>
                                                        Último uso: {formatDate(key.lastUsedAt)}
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-500/10 text-green-500">
                                                <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                                                Ativa
                                            </div>

                                            <Button.Root
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleOpenRevokeModal(key.id, key.name)}
                                                className="text-red-400 hover:text-red-300"
                                            >
                                                <Button.Icon>
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                                                    </svg>
                                                </Button.Icon>
                                                <Button.Text>Revogar</Button.Text>
                                            </Button.Root>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {revokedKeys.length > 0 && (
                    <div>
                        <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                            <div className="w-2 h-2 bg-gray-500 rounded-full" />
                            Revogadas ({revokedKeys.length})
                        </h2>

                        <div className="grid gap-4">
                            {revokedKeys.map((key) => (
                                <div
                                    key={key.id}
                                    className="bg-[#16181D] border border-[#252A31] rounded-xl p-6 opacity-60"
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-start gap-4 flex-1">
                                            <div className="w-12 h-12 bg-gray-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                                                <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                                                </svg>
                                            </div>

                                            <div className="flex-1 min-w-0">
                                                <h3 className="text-lg font-semibold text-white mb-1">
                                                    {key.name}
                                                </h3>
                                                <div className="flex items-center gap-3 text-sm text-gray-400">
                                                    <span className="font-mono">{key.keyPrefix}...</span>
                                                    <span>•</span>
                                                    <span>Criada em {formatDate(key.createdAt)}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-gray-500/10 text-gray-500">
                                            <div className="w-1.5 h-1.5 rounded-full bg-gray-500" />
                                            Revogada
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <Modal.Root open={isCreateModalOpen} onClose={handleCloseCreateModal} size="md">
                <Modal.Content>
                    <Modal.Header onClose={handleCloseCreateModal}>
                        Criar Nova API Key
                    </Modal.Header>

                    <form onSubmit={handleSubmit}>
                        <Modal.Body>
                            <Input.Root
                                label="Nome da API Key"
                                placeholder="Ex: Produção, Desenvolvimento, Testes..."
                                value={formData.name}
                                onChange={(e) => {
                                    setFormData({ name: e.target.value });
                                    if (errors.name) setErrors({});
                                }}
                                error={errors.name}
                                disabled={createMutation.isPending}
                                autoFocus
                            />

                            <div className="mt-4 p-4 bg-yellow-500/5 border border-yellow-500/20 rounded-lg">
                                <p className="text-xs text-yellow-500/80 leading-relaxed">
                                    <strong>Atenção:</strong> A API Key completa será exibida apenas uma vez após a criação.
                                    Certifique-se de copiá-la e armazená-la em um local seguro.
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
                                <Button.Text>Criar API Key</Button.Text>
                            </Button.Root>
                        </Modal.Footer>
                    </form>
                </Modal.Content>
            </Modal.Root>

            <Modal.Root open={isKeyModalOpen} onClose={handleCloseKeyModal} size="lg">
                <Modal.Content>
                    <Modal.Header onClose={handleCloseKeyModal}>
                        API Key Criada com Sucesso!
                    </Modal.Header>

                    <Modal.Body>
                        <div className="space-y-4">
                            <div className="p-4 bg-green-500/5 border border-green-500/20 rounded-lg">
                                <div className="flex gap-3">
                                    <div className="flex-shrink-0">
                                        <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h4 className="text-white font-semibold mb-1">
                                            {createdKey?.name}
                                        </h4>
                                        <p className="text-sm text-gray-400">
                                            Sua API Key foi criada com sucesso. Copie e guarde em um local seguro.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    API Key
                                </label>
                                <div className="flex gap-2">
                                    <div className="flex-1 px-4 py-3 bg-[#0F1419] border border-[#252A31] rounded-lg font-mono text-sm text-white break-all">
                                        {createdKey?.plainKey}
                                    </div>
                                    <Button.Root
                                        variant="secondary"
                                        onClick={handleCopyKey}
                                    >
                                        <Button.Icon>
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                            </svg>
                                        </Button.Icon>
                                        <Button.Text>Copiar</Button.Text>
                                    </Button.Root>
                                </div>
                            </div>

                            <div className="p-4 bg-red-500/5 border border-red-500/20 rounded-lg">
                                <div className="flex gap-3">
                                    <div className="flex-shrink-0">
                                        <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h4 className="text-red-400 font-semibold mb-1">
                                            Importante!
                                        </h4>
                                        <p className="text-sm text-red-400/80 leading-relaxed">
                                            Esta é a única vez que você verá a API Key completa. Certifique-se de copiá-la agora.
                                            Se você perder esta chave, precisará criar uma nova.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Modal.Body>

                    <Modal.Footer>
                        <Button.Root
                            variant="primary"
                            onClick={handleCloseKeyModal}
                        >
                            <Button.Text>Entendi, já copiei a chave</Button.Text>
                        </Button.Root>
                    </Modal.Footer>
                </Modal.Content>
            </Modal.Root>

            <Modal.Root open={isRevokeModalOpen} onClose={handleCloseRevokeModal} size="sm">
                <Modal.Content>
                    <Modal.Header onClose={handleCloseRevokeModal}>
                        Revogar API Key
                    </Modal.Header>

                    <Modal.Body>
                        <p className="text-gray-300 mb-4">
                            Tem certeza que deseja revogar a API Key <strong className="text-white">"{selectedKeyName}"</strong>?
                        </p>
                        <div className="p-4 bg-red-500/5 border border-red-500/20 rounded-lg">
                            <p className="text-sm text-red-400/80 leading-relaxed">
                                Esta ação é irreversível. A chave não poderá mais ser usada para autenticar requisições.
                            </p>
                        </div>
                    </Modal.Body>

                    <Modal.Footer>
                        <Button.Root
                            variant="ghost"
                            onClick={handleCloseRevokeModal}
                            disabled={revokeMutation.isPending}
                        >
                            <Button.Text>Cancelar</Button.Text>
                        </Button.Root>

                        <Button.Root
                            variant="danger"
                            onClick={handleRevoke}
                            loading={revokeMutation.isPending}
                        >
                            <Button.Text>Revogar API Key</Button.Text>
                        </Button.Root>
                    </Modal.Footer>
                </Modal.Content>
            </Modal.Root>
        </DashboardLayout>
    );
}