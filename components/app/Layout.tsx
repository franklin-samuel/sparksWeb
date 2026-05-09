'use client';

import React, { useState } from 'react';
import { Sidebar } from '@/components/app/Sidebar';

interface DashboardLayoutProps {
    children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen bg-[#0F1419] bg-grid-pattern">
            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            <div className="lg:pl-72 min-h-screen">
                {/* Mobile Header */}
                <header className="lg:hidden sticky top-0 z-30 bg-[#16181D]/95 backdrop-blur-sm border-b border-[#252A31]">
                    <div className="flex items-center justify-between p-4">
                        <div className="flex items-center gap-3">
                            <svg
                                className="w-8 h-8 text-[#00D4FF]"
                                viewBox="0 0 64 64"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M32 4L24 28H36L28 60L48 32H36L44 4H32Z"
                                    fill="currentColor"
                                />
                                <circle cx="32" cy="28" r="3" fill="#FFB800" />
                            </svg>
                            <h1 className="text-lg font-bold text-white">Sparks</h1>
                        </div>

                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="text-gray-400 hover:text-white p-2 hover:bg-[#252A31] rounded-lg transition-colors"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
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