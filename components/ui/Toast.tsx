'use client';

import React, { useEffect, useState } from 'react';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastProps {
    id: string;
    message: string;
    type: ToastType;
    duration?: number;
    onClose: () => void;
}

export function Toast({ id, message, type, duration = 5000, onClose }: ToastProps) {
    const [isExiting, setIsExiting] = useState(false);
    const [progress, setProgress] = useState(100);

    useEffect(() => {
        const startTime = Date.now();
        const interval = setInterval(() => {
            const elapsed = Date.now() - startTime;
            const remaining = Math.max(0, 100 - (elapsed / duration) * 100);
            setProgress(remaining);

            if (remaining === 0) {
                clearInterval(interval);
            }
        }, 10);

        const timer = setTimeout(() => {
            setIsExiting(true);
            setTimeout(onClose, 300);
        }, duration);

        return () => {
            clearTimeout(timer);
            clearInterval(interval);
        };
    }, [duration, onClose]);

    const handleClose = () => {
        setIsExiting(true);
        setTimeout(onClose, 300);
    };

    const typeStyles = {
        success: 'bg-[#0A0A0A] border-green-500',
        error: 'bg-[#0A0A0A] border-red-500',
        info: 'bg-[#0A0A0A] border-[#00D9FF]',
        warning: 'bg-[#0A0A0A] border-yellow-500'
    };

    const iconColors = {
        success: 'text-green-500',
        error: 'text-red-500',
        info: 'text-[#00D9FF]',
        warning: 'text-yellow-500'
    };

    const progressColors = {
        success: 'bg-green-500',
        error: 'bg-red-500',
        info: 'bg-[#00D9FF]',
        warning: 'bg-yellow-500'
    };

    const icons = {
        success: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="square" strokeLinejoin="miter" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        ),
        error: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="square" strokeLinejoin="miter" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        ),
        info: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="square" strokeLinejoin="miter" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        ),
        warning: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="square" strokeLinejoin="miter" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
        )
    };

    return (
        <div
            className={`
        relative min-w-[320px] max-w-md border-2 overflow-hidden chamfer-sm
        ${typeStyles[type]}
        ${isExiting ? 'animate-slide-out-right' : 'animate-slide-in-right'}
      `}
            role="alert"
        >
            {/* Progress bar */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10">
                <div
                    className={`h-full transition-all ease-linear ${progressColors[type]}`}
                    style={{ width: `${progress}%` }}
                />
            </div>

            {/* Content */}
            <div className="flex items-start gap-3 p-4">
                <div className={iconColors[type]}>
                    {icons[type]}
                </div>

                <div className="flex-1 pt-0.5">
                    <p className="text-sm text-white body-text leading-relaxed">
                        {message}
                    </p>
                </div>

                <button
                    onClick={handleClose}
                    className="text-white/50 hover:text-white transition-colors flex-shrink-0"
                    aria-label="Fechar"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                        <path strokeLinecap="square" strokeLinejoin="miter" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
        </div>
    );
}