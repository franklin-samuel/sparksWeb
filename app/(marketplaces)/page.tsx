'use client';

import React, { useState } from 'react';
import { DashboardLayout } from '@/components/app/Layout';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Loading } from '@/components/ui/Loading';
import Image from 'next/image';
import {
    useMercadoLivreConfig,
    useCreateMercadoLivreConfig,
    useUpdateMercadoLivreConfig,
    useDeleteMercadoLivreConfig
} from '@/hooks/useMarketplace';
import type { CreateMercadoLivreConfigRequest } from '@/types/marketplace';

export default function MarketplacesPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const { data: mercadoLivreConfig, isLoading } = useMercadoLivreConfig();
    const createMutation = useCreateMercadoLivreConfig();
    const updateMutation = useUpdateMercadoLivreConfig();
    const deleteMutation = useDeleteMercadoLivreConfig();

    const [formData, setFormData] = useState<CreateMercadoLivreConfigRequest>({
        cookie: '',
        tag: ''
    });

    const [errors, setErrors] = useState<{ cookie?: string; tag?: string }>({});

    const isConfigured = !!mercadoLivreConfig;
    const isActive = mercadoLivreConfig?.active ?? false;

    const handleOpenModal = () => {
        if (mercadoLivreConfig) {
            setFormData({
                cookie: '',
                tag: mercadoLivreConfig.credentials.tag || ''
            });
        } else {
            setFormData({ cookie: '', tag: '' });
        }
        setErrors({});
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setFormData({ cookie: '', tag: '' });
        setErrors({});
    };

    const validate = () => {
        const newErrors: { cookie?: string; tag?: string } = {};

        if (!formData.cookie.trim()) {
            newErrors.cookie = 'Cookie é obrigatório';
        }

        if (!formData.tag.trim()) {
            newErrors.tag = 'Tag é obrigatória';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validate()) return;

        try {
            if (isConfigured) {
                await updateMutation.mutateAsync({
                    cookie: formData.cookie,
                    tag: formData.tag
                });
            } else {
                await createMutation.mutateAsync(formData);
            }
            handleCloseModal();
        } catch (err) {
            console.error(err);
        }
    };

    const handleDelete = async () => {
        try {
            await deleteMutation.mutateAsync();
            setIsDeleteModalOpen(false);
        } catch (err) {
            console.error(err);
        }
    };

    if (isLoading) {
        return (
            <DashboardLayout>
                <Loading.Screen message="Carregando configurações..." />
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">
                        Marketplaces
                    </h1>
                    <p className="text-gray-400">
                        Configure suas credenciais de afiliados para cada marketplace
                    </p>
                </div>

                {/* Marketplaces Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Mercado Livre Card */}
                    <div className="bg-[#16181D] border border-[#252A31] rounded-xl p-6 hover:border-[#00D4FF]/50 transition-all duration-200">
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center overflow-hidden p-1">
                                    <Image
                                        src="/mercado-livre.svg"
                                        alt="Mercado Livre"
                                        width={40}
                                        height={40}
                                        className="object-contain"
                                    />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-white">Mercado Livre</h3>
                                    <p className="text-xs text-gray-500">
                                        {isConfigured ? 'Configurado' : 'Não configurado'}
                                    </p>
                                </div>
                            </div>

                            {isConfigured && (
                                <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                                    isActive
                                        ? 'bg-green-500/10 text-green-500'
                                        : 'bg-gray-500/10 text-gray-500'
                                }`}>
                                    <div className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-green-500' : 'bg-gray-500'}`} />
                                    {isActive ? 'Ativo' : 'Inativo'}
                                </div>
                            )}
                        </div>

                        {isConfigured && mercadoLivreConfig && (
                            <div className="mb-4 p-3 bg-[#0F1419] rounded-lg border border-[#252A31]">
                                <p className="text-xs text-gray-500 mb-1">Tag de afiliado</p>
                                <p className="text-sm text-white font-mono break-all">
                                    {mercadoLivreConfig.credentials.tag}
                                </p>
                            </div>
                        )}

                        <div className="flex gap-2">
                            <Button.Root
                                variant={isConfigured ? 'secondary' : 'primary'}
                                size="sm"
                                className="flex-1"
                                onClick={handleOpenModal}
                            >
                                <Button.Icon>
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        {isConfigured ? (
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                        ) : (
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                        )}
                                    </svg>
                                </Button.Icon>
                                <Button.Text>
                                    {isConfigured ? 'Editar' : 'Configurar'}
                                </Button.Text>
                            </Button.Root>

                            {isConfigured && (
                                <>
                                    <Button.Root
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setIsDeleteModalOpen(true)}
                                        className="text-red-400 hover:text-red-300"
                                    >
                                        <Button.Icon>
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </Button.Icon>
                                    </Button.Root>
                                </>
                            )}
                        </div>
                    </div>

                    <div className="bg-[#16181D] border border-[#252A31] rounded-xl p-6 opacity-50 cursor-not-allowed">
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center overflow-hidden p-1">
                                    <Image
                                        src="/amazon.svg"
                                        alt="Amazon"
                                        width={30}
                                        height={30}
                                        className="object-contain"
                                    />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-white">Amazon</h3>
                                    <p className="text-xs text-gray-500">Em breve</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-[#16181D] border border-[#252A31] rounded-xl p-6 opacity-50 cursor-not-allowed">
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center overflow-hidden p-1">
                                    <Image
                                        src="/shopee.svg"
                                        alt="Shopee"
                                        width={25}
                                        height={25}
                                        className="object-contain"
                                    />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-white">Shopee</h3>
                                    <p className="text-xs text-gray-500">Em breve</p>
                                </div>
                            </div>
                        </div>
                    </div>
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
                                Como obter as credenciais?
                            </h3>
                            <p className="text-gray-400 text-sm leading-relaxed">
                                Para configurar o Mercado Livre, você precisará do <strong className="text-white">cookie</strong> de autenticação
                                e da sua <strong className="text-white">tag de afiliado</strong>. Acesse o painel de afiliados do Mercado Livre
                                para obter essas informações.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <Modal.Root open={isModalOpen} onClose={handleCloseModal} size="md">
                <Modal.Content>
                    <Modal.Header onClose={handleCloseModal}>
                        {isConfigured ? 'Editar' : 'Configurar'} Mercado Livre
                    </Modal.Header>

                    <form onSubmit={handleSubmit}>
                        <Modal.Body>
                            <Input.Group>
                                <Input.Root
                                    label="Cookie de Autenticação"
                                    placeholder="Cole aqui o cookie completo"
                                    value={formData.cookie}
                                    onChange={(e) => {
                                        setFormData(prev => ({ ...prev, cookie: e.target.value }));
                                        if (errors.cookie) setErrors(prev => ({ ...prev, cookie: undefined }));
                                    }}
                                    error={errors.cookie}
                                    disabled={createMutation.isPending || updateMutation.isPending}
                                />

                                <Input.Root
                                    label="Tag de Afiliado"
                                    placeholder="Ex: MEUAFILIADO-123"
                                    value={formData.tag}
                                    onChange={(e) => {
                                        setFormData(prev => ({ ...prev, tag: e.target.value }));
                                        if (errors.tag) setErrors(prev => ({ ...prev, tag: undefined }));
                                    }}
                                    error={errors.tag}
                                    disabled={createMutation.isPending || updateMutation.isPending}
                                />
                            </Input.Group>

                            <div className="mt-4 p-4 bg-yellow-500/5 border border-yellow-500/20 rounded-lg">
                                <p className="text-xs text-yellow-500/80 leading-relaxed">
                                    <strong>Atenção:</strong> O cookie de autenticação expira periodicamente.
                                    Se a conversão de links parar de funcionar, atualize o cookie aqui.
                                </p>
                            </div>
                        </Modal.Body>

                        <Modal.Footer>
                            <Button.Root
                                variant="ghost"
                                onClick={handleCloseModal}
                                disabled={createMutation.isPending || updateMutation.isPending}
                            >
                                <Button.Text>Cancelar</Button.Text>
                            </Button.Root>

                            <Button.Root
                                type="submit"
                                variant="primary"
                                loading={createMutation.isPending || updateMutation.isPending}
                            >
                                <Button.Text>
                                    {isConfigured ? 'Atualizar' : 'Salvar'}
                                </Button.Text>
                            </Button.Root>
                        </Modal.Footer>
                    </form>
                </Modal.Content>
            </Modal.Root>

            <Modal.Root open={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} size="sm">
                <Modal.Content>
                    <Modal.Header onClose={() => setIsDeleteModalOpen(false)}>
                        Remover Configuração
                    </Modal.Header>

                    <Modal.Body>
                        <p className="text-gray-300">
                            Tem certeza que deseja remover a configuração do Mercado Livre?
                            Você não conseguirá converter links até configurar novamente.
                        </p>
                    </Modal.Body>

                    <Modal.Footer>
                        <Button.Root
                            variant="ghost"
                            onClick={() => setIsDeleteModalOpen(false)}
                            disabled={deleteMutation.isPending}
                        >
                            <Button.Text>Cancelar</Button.Text>
                        </Button.Root>

                        <Button.Root
                            variant="danger"
                            onClick={handleDelete}
                            loading={deleteMutation.isPending}
                        >
                            <Button.Text>Remover</Button.Text>
                        </Button.Root>
                    </Modal.Footer>
                </Modal.Content>
            </Modal.Root>
        </DashboardLayout>
    );
}