'use client';

import React, { useState } from 'react';
import { Sidebar } from '@/components/app/Sidebar';

interface DashboardLayoutProps {
    children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen bg-[#0A0A0A] bg-pattern">
            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            <div className="lg:pl-72 min-h-screen">
                <header className="lg:hidden sticky top-0 z-30 bg-[#0A0A0A] border-b-2 border-white/20 backdrop-blur-sm">
                    <div className="flex items-center justify-between p-4">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-white flex items-center justify-center chamfer-sm">
                                <div className="w-6 h-6 bg-[#0A0A0A] flex items-center justify-center chamfer-sm">
                                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                                        <path strokeLinecap="square" strokeLinejoin="miter" d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                </div>
                            </div>
                            <h1 className="text-sm font-bold text-white">SR. BARRIGA BOT</h1>
                        </div>

                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="text-white p-2 hover:bg-white/10 transition-colors"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                <path strokeLinecap="square" strokeLinejoin="miter" d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                    </div>
                </header>

                <main className="p-6 lg:p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}