import React from 'react';

interface LoadingRootProps {
    size?: 'sm' | 'md' | 'lg' | 'xl';
    variant?: 'spinner' | 'dots' | 'pulse' | 'line' | 'minimal';
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

    // Spinner circular clean
    if (variant === 'spinner') {
        return (
            <div className={`${sizeClasses[size]} ${className}`}>
                <div className="w-full h-full border-2 border-white/20 border-t-white rounded-full animate-spin" />
            </div>
        );
    }

    // Dots pulsantes
    if (variant === 'dots') {
        const dotSize = {
            sm: 'w-1.5 h-1.5',
            md: 'w-2 h-2',
            lg: 'w-3 h-3',
            xl: 'w-4 h-4'
        };

        return (
            <div className={`flex gap-1.5 ${className}`}>
                <div className={`${dotSize[size]} bg-white rounded-full animate-bounce`} style={{ animationDelay: '0ms' }} />
                <div className={`${dotSize[size]} bg-white rounded-full animate-bounce`} style={{ animationDelay: '150ms' }} />
                <div className={`${dotSize[size]} bg-white rounded-full animate-bounce`} style={{ animationDelay: '300ms' }} />
            </div>
        );
    }

    // Linha animada (progress bar infinita)
    if (variant === 'line') {
        const lineHeight = {
            sm: 'h-0.5',
            md: 'h-1',
            lg: 'h-1.5',
            xl: 'h-2'
        };

        return (
            <div className={`w-full ${lineHeight[size]} bg-white/10 overflow-hidden ${className}`}>
                <div className="h-full w-1/3 bg-white animate-line-loader" />
            </div>
        );
    }

    // Minimal - apenas 3 barrinhas
    if (variant === 'minimal') {
        const barHeight = {
            sm: 'h-3',
            md: 'h-4',
            lg: 'h-6',
            xl: 'h-8'
        };

        const barWidth = {
            sm: 'w-0.5',
            md: 'w-1',
            lg: 'w-1.5',
            xl: 'w-2'
        };

        return (
            <div className={`flex gap-1 items-center ${className}`}>
                <div className={`${barWidth[size]} ${barHeight[size]} bg-white animate-bar-1`} />
                <div className={`${barWidth[size]} ${barHeight[size]} bg-white animate-bar-2`} />
                <div className={`${barWidth[size]} ${barHeight[size]} bg-white animate-bar-3`} />
            </div>
        );
    }

    // Pulse
    if (variant === 'pulse') {
        return (
            <div className={`${sizeClasses[size]} ${className}`}>
                <div className="w-full h-full bg-white rounded-full animate-pulse-soft" />
            </div>
        );
    }

    return null;
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
            <div className="bg-[#0A0A0A] border-2 border-white p-8 flex flex-col items-center gap-4 animate-slide-in-up chamfer">
                {children || <LoadingRoot size="lg" variant="minimal" />}
                {message && (
                    <p className="text-white body-text text-center">
                        {message}
                    </p>
                )}
            </div>
        </div>
    );
};

interface LoadingScreenProps {
    message?: string;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ message = 'Carregando...' }) => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0A0A0A] bg-pattern">
            <div className="flex flex-col items-center gap-8">
                {/* Logo Chip */}
                <div className="relative">
                    <div className="absolute inset-0 bg-white/20 blur-2xl animate-glow" />
                    <div className="relative w-24 h-24 bg-white flex items-center justify-center chamfer">
                        <div className="w-20 h-20 bg-[#0A0A0A] flex items-center justify-center chamfer-sm">
                            <img alt="Logo Computaria" src="logo.png" className="w-20 h-20" />
                        </div>
                    </div>
                </div>

                <LoadingRoot size="md" variant="minimal" />

                <p className="text-white/70 body-text text-lg tracking-wide">
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
    variant?: 'spinner' | 'dots' | 'pulse' | 'line' | 'minimal';
}

const LoadingInline: React.FC<LoadingInlineProps> = ({
                                                         size = 'md',
                                                         text,
                                                         className = '',
                                                         variant = 'minimal'
                                                     }) => {
    return (
        <div className={`flex items-center gap-3 ${className}`}>
            <LoadingRoot size={size} variant={variant} />
            {text && (
                <span className="text-white/70 body-text">
                    {text}
                </span>
            )}
        </div>
    );
};

export const Loading = {
    Root: LoadingRoot,
    Overlay: LoadingOverlay,
    Screen: LoadingScreen,
    Inline: LoadingInline
};