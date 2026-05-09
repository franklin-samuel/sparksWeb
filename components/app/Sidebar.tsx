'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import {Loading} from "@/components/ui/Loading";

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
    const pathname = usePathname();
    const { user, logout } = useAuth();

    const menuItems = [
        {
            name: 'HOME',
            path: '/',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                    <path strokeLinecap="square" strokeLinejoin="miter" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
            ),
        },
        {
            name: 'CONFIGURAÇÕES',
            path: '/settings',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                    <path strokeLinecap="square" strokeLinejoin="miter" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="square" strokeLinejoin="miter" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
            ),
        },
    ];

    const isActive = (path: string) => pathname === path;

    return (
        <>
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
                    onClick={onClose}
                />
            )}

            <aside
                className={`
                    fixed top-0 left-0 h-full w-72 bg-[#0A0A0A] border-r-2 border-white z-50
                    transform transition-transform duration-300 ease-in-out
                    ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
                `}
            >
                <div className="p-6 border-b-2 border-white/20">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="relative w-10 h-10 bg-white flex items-center justify-center chamfer-sm">
                                <div className="w-8 h-8 bg-[#0A0A0A] flex items-center justify-center chamfer-sm">
                                    <img src="logo.png" className="w-8 h-8" />
                                </div>
                            </div>

                            <div>
                                <h1 className="text-sm font-bold text-white">
                                    SR. BARRIGA
                                </h1>
                                <p className="text-xs tech-text text-white/40 tracking-wider">
                                    BOT
                                </p>
                            </div>
                        </div>

                        <button
                            onClick={onClose}
                            className="lg:hidden text-white/50 hover:text-white transition-colors"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                <path strokeLinecap="square" strokeLinejoin="miter" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>

                <div className="p-6 border-b-2 border-white/20">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white/10 border border-white/30 flex items-center justify-center chamfer-sm">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                <path strokeLinecap="square" strokeLinejoin="miter" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm text-white body-text truncate">
                                {user?.name || <Loading.Root size="md" variant="line"/>}
                            </p>
                            <p className="text-xs text-white/40 tech-text truncate">
                                {user?.email || ''}
                            </p>
                        </div>
                    </div>
                </div>

                <nav className="flex-1 p-4">
                    <div className="space-y-2">
                        {menuItems.map((item) => (
                            <Link
                                key={item.path}
                                href={item.path}
                                onClick={onClose}
                                className={`
                                    flex items-center gap-3 px-4 py-3 tech-text text-sm
                                    border-2 transition-all duration-200
                                    ${
                                    isActive(item.path)
                                        ? 'bg-white text-black border-white'
                                        : 'bg-transparent text-white border-white/30 hover:border-white hover-glow'
                                }
                                `}
                            >
                                {item.icon}
                                <span>{item.name}</span>
                            </Link>
                        ))}
                    </div>
                </nav>

                <div className="p-4 border-t-2 border-white/20">
                    <button
                        onClick={logout}
                        className="w-full flex items-center gap-3 px-4 py-3 tech-text text-sm
                                   bg-transparent text-white border-2 border-red-500
                                   hover:bg-red-500 hover:text-white transition-all duration-200"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                            <path strokeLinecap="square" strokeLinejoin="miter" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        <span>SAIR</span>
                    </button>

                    <div className="mt-4 pt-4 border-t border-white/10 text-center">
                        <p className="text-xs tech-text text-white/30 tracking-widest">
                            © 2025 COMPUTARIA
                        </p>
                        <p className="text-xs body-text text-white/20 mt-1">
                            &gt;_compilando vitórias
                        </p>
                    </div>
                </div>
            </aside>
        </>
    );
}