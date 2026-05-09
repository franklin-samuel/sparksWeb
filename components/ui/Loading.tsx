import React from 'react';

interface LoadingRootProps {
    size?: 'sm' | 'md' | 'lg' | 'xl';
    variant?: 'spinner' | 'dots' | 'pulse';
    className?: string;
}

const LoadingRoot: React.FC<LoadingRootProps> = ({
                                                     size = 'md',
                                                     variant = 'spinner',
                                                     className = ''
                                                 }) => {
    const sizeClasses = {
        sm: 'w-4 h-4',
        md: 'w-8 h-8',
        lg: 'w-12 h-12',
        xl: 'w-16 h-16'
    };

    if (variant === 'spinner') {
        return (
            <div className={`${sizeClasses[size]} ${className}`}>
                <div className="w-full h-full border-2 border-[#252A31] border-t-[#00D4FF] rounded-full animate-spin" />
            </div>
        );
    }

    if (variant === 'dots') {
        const dotSize = {
            sm: 'w-1.5 h-1.5',
            md: 'w-2 h-2',
            lg: 'w-3 h-3',
            xl: 'w-4 h-4'
        };

        return (
            <div className={`flex gap-1.5 ${className}`}>
                <div className={`${dotSize[size]} bg-[#00D4FF] rounded-full animate-bounce`} style={{ animationDelay: '0ms' }} />
                <div className={`${dotSize[size]} bg-[#5CE1FF] rounded-full animate-bounce`} style={{ animationDelay: '150ms' }} />
                <div className={`${dotSize[size]} bg-[#FFB800] rounded-full animate-bounce`} style={{ animationDelay: '300ms' }} />
            </div>
        );
    }

    if (variant === 'pulse') {
        return (
            <div className={`${sizeClasses[size]} ${className}`}>
                <div className="w-full h-full bg-[#00D4FF] rounded-full animate-pulse" />
            </div>
        );
    }

    return null;
};

interface LoadingScreenProps {
    message?: string;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ message = 'Carregando...' }) => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0F1419] bg-grid-pattern">
            <div className="flex flex-col items-center gap-6">
                {/* Spark Logo */}
                <div className="relative">
                    <div className="absolute inset-0 bg-[#00D4FF]/30 blur-2xl animate-pulse-spark" />
                    <div className="relative">
                        <svg
                            className="w-20 h-20 text-[#00D4FF]"
                            viewBox="0 0 64 64"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M32 4L24 28H36L28 60L48 32H36L44 4H32Z"
                                fill="currentColor"
                                className="drop-shadow-[0_0_10px_rgba(0,212,255,0.8)]"
                            />
                            <circle cx="32" cy="28" r="3" fill="#FFB800" />
                            <circle cx="36" cy="32" r="2" fill="#5CE1FF" />
                        </svg>
                    </div>
                </div>

                <LoadingRoot size="md" variant="dots" />

                <p className="text-gray-400 text-base">
                    {message}
                </p>
            </div>
        </div>
    );
};

interface LoadingInlineProps {
    size?: 'sm' | 'md' | 'lg';
    text?: string;
    className?: string;
    variant?: 'spinner' | 'dots' | 'pulse';
}

const LoadingInline: React.FC<LoadingInlineProps> = ({
                                                         size = 'md',
                                                         text,
                                                         className = '',
                                                         variant = 'spinner'
                                                     }) => {
    return (
        <div className={`flex items-center gap-3 ${className}`}>
            <LoadingRoot size={size} variant={variant} />
            {text && (
                <span className="text-gray-400 text-sm">
                    {text}
                </span>
            )}
        </div>
    );
};

interface LoadingOverlayProps {
    show: boolean;
    message?: string;
    children?: React.ReactNode;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ show, message, children }) => {
    if (!show) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
            <div className="bg-[#16181D] border border-[#252A31] rounded-2xl p-8 flex flex-col items-center gap-4 animate-slide-in-up">
                {children || <LoadingRoot size="lg" variant="dots" />}
                {message && (
                    <p className="text-white text-center">
                        {message}
                    </p>
                )}
            </div>
        </div>
    );
};

export const Loading = {
    Root: LoadingRoot,
    Screen: LoadingScreen,
    Inline: LoadingInline,
    Overlay: LoadingOverlay
};