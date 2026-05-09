import React from 'react';

interface ModalRootProps {
    open: boolean;
    onClose: () => void;
    children: React.ReactNode;
    size?: 'sm' | 'md' | 'lg' | 'xl';
}

const ModalRoot: React.FC<ModalRootProps> = ({ open, onClose, children, size = 'md' }) => {
    React.useEffect(() => {
        if (open) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [open]);

    React.useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && open) {
                onClose();
            }
        };

        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [open, onClose]);

    if (!open) return null;

    const sizeClasses = {
        sm: 'max-w-sm',
        md: 'max-w-md',
        lg: 'max-w-lg',
        xl: 'max-w-2xl'
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"
                onClick={onClose}
            />

            {/* Modal Container */}
            <div className={`relative z-10 w-full ${sizeClasses[size]} animate-slide-in-up`}>
                {children}
            </div>
        </div>
    );
};

interface ModalContentProps {
    children: React.ReactNode;
    className?: string;
}

const ModalContent: React.FC<ModalContentProps> = ({ children, className = '' }) => {
    return (
        <div className={`bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl overflow-hidden ${className}`}>
            {children}
        </div>
    );
};

interface ModalHeaderProps {
    children: React.ReactNode;
    onClose?: () => void;
    showCloseButton?: boolean;
}

const ModalHeader: React.FC<ModalHeaderProps> = ({ children, onClose, showCloseButton = true }) => {
    return (
        <div className="flex items-center justify-between p-6 border-b border-zinc-200 dark:border-zinc-800">
            <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
                {children}
            </h2>
            {showCloseButton && onClose && (
                <button
                    onClick={onClose}
                    className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg p-2"
                    aria-label="Fechar"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            )}
        </div>
    );
};

interface ModalBodyProps {
    children: React.ReactNode;
    className?: string;
}

const ModalBody: React.FC<ModalBodyProps> = ({ children, className = '' }) => {
    return (
        <div className={`p-6 ${className}`}>
            {children}
        </div>
    );
};

interface ModalFooterProps {
    children: React.ReactNode;
    className?: string;
}

const ModalFooter: React.FC<ModalFooterProps> = ({ children, className = '' }) => {
    return (
        <div className={`flex items-center justify-end gap-3 p-6 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 ${className}`}>
            {children}
        </div>
    );
};

interface ModalTitleProps {
    children: React.ReactNode;
    className?: string;
}

const ModalTitle: React.FC<ModalTitleProps> = ({ children, className = '' }) => {
    return (
        <h3 className={`text-lg font-semibold text-zinc-900 dark:text-zinc-50 ${className}`}>
            {children}
        </h3>
    );
};

interface ModalDescriptionProps {
    children: React.ReactNode;
    className?: string;
}

const ModalDescription: React.FC<ModalDescriptionProps> = ({ children, className = '' }) => {
    return (
        <p className={`text-zinc-600 dark:text-zinc-400 mt-2 ${className}`}>
            {children}
        </p>
    );
};

export const Modal = {
    Root: ModalRoot,
    Content: ModalContent,
    Header: ModalHeader,
    Body: ModalBody,
    Footer: ModalFooter,
    Title: ModalTitle,
    Description: ModalDescription
};