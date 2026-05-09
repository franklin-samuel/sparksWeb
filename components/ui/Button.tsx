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
    const baseStyles = 'tech-text font-normal transition-all duration-200 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 relative overflow-hidden border-2';

    const variantStyles = {
        primary: 'bg-white text-black border-white hover-glow hover:bg-transparent hover:text-white',
        secondary: 'bg-transparent text-white border-white hover-glow-accent hover:bg-white hover:text-black',
        ghost: 'bg-transparent text-white border-transparent hover:border-white hover-glow',
        danger: 'bg-red-600 text-white border-red-600 hover-glow hover:bg-transparent hover:border-red-600'
    };

    const sizeStyles = {
        sm: 'px-4 py-2 text-xs',
        md: 'px-6 py-3 text-sm',
        lg: 'px-8 py-4 text-base'
    };

    return (
        <button
            className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
            disabled={disabled || loading}
            {...props}
        >
            {loading && (
                <div className="absolute inset-0 bg-inherit flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-current border-t-transparent animate-spin" />
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
    position?: 'left' | 'right';
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