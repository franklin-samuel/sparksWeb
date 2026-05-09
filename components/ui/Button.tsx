import React from 'react';

interface ButtonRootProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
    size?: 'sm' | 'md' | 'lg';
    loading?: boolean;
    children: React.ReactNode;
}

const ButtonRoot: React.FC<ButtonRootProps> = ({
                                                   variant = 'primary',
                                                   size = 'md',
                                                   className = '',
                                                   children,
                                                   disabled,
                                                   loading = false,
                                                   ...props
                                               }) => {
    const baseStyles = 'font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#16181D] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 relative overflow-hidden rounded-lg';

    const variantStyles = {
        primary: 'bg-[#00D4FF] text-[#0F1419] hover:bg-[#5CE1FF] focus:ring-[#00D4FF] font-semibold shadow-lg shadow-[#00D4FF]/20 hover:shadow-[#00D4FF]/30',
        secondary: 'bg-[#252A31] text-white hover:bg-[#2D343C] border border-[#3A424D] focus:ring-[#00D4FF]',
        ghost: 'bg-transparent text-gray-300 hover:bg-[#252A31] hover:text-white focus:ring-[#00D4FF]',
        danger: 'bg-red-500 text-white hover:bg-red-600 focus:ring-red-500 shadow-lg shadow-red-500/20'
    };

    const sizeStyles = {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-4 py-2 text-sm',
        lg: 'px-6 py-3 text-base'
    };

    return (
        <button
            className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
            disabled={disabled || loading}
            {...props}
        >
            {loading && (
                <div className="absolute inset-0 bg-inherit flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                </div>
            )}
            <span className={loading ? 'invisible' : 'flex items-center gap-2'}>
                {children}
            </span>
        </button>
    );
};

interface ButtonIconProps {
    children: React.ReactNode;
}

const ButtonIcon: React.FC<ButtonIconProps> = ({ children }) => {
    return <span className="inline-flex items-center shrink-0">{children}</span>;
};

interface ButtonTextProps {
    children: React.ReactNode;
}

const ButtonText: React.FC<ButtonTextProps> = ({ children }) => {
    return <span>{children}</span>;
};

export const Button = {
    Root: ButtonRoot,
    Icon: ButtonIcon,
    Text: ButtonText
};