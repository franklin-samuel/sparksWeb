import React, { forwardRef } from 'react';

interface InputRootProps extends React.InputHTMLAttributes<HTMLInputElement> {
    error?: string;
    label?: string;
}

const InputRoot = forwardRef<HTMLInputElement, InputRootProps>(
    ({ error, label, className = '', id, ...props }, ref) => {
        const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

        return (
            <div className="w-full">
                {label && (
                    <label
                        htmlFor={inputId}
                        className="block text-xs tech-text text-white/70 mb-2 tracking-wider"
                    >
                        {label}
                    </label>
                )}
                <input
                    ref={ref}
                    id={inputId}
                    className={`
                        w-full px-4 py-3
                        bg-transparent
                        border-b-2 ${error ? 'border-red-500' : 'border-white/30'}
                        text-white body-text
                        placeholder:text-white/40 placeholder:font-normal
                        focus:outline-none focus:border-white
                        transition-all duration-200
                        disabled:opacity-50 disabled:cursor-not-allowed
                        ${className}
                    `}
                    {...props}
                />
                {error && (
                    <p className="mt-2 text-xs text-red-500 body-text flex items-center gap-1">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {error}
                    </p>
                )}
            </div>
        );
    }
);

InputRoot.displayName = 'InputRoot';

interface InputIconProps {
    children: React.ReactNode;
    position?: 'left' | 'right';
    onClick?: () => void;
}

const InputIcon: React.FC<InputIconProps> = ({ children, position = 'left', onClick }) => {
    const positionClasses = position === 'left' ? 'left-0' : 'right-0';

    return (
        <div
            className={`absolute bottom-3 ${positionClasses} text-white/50 ${onClick ? 'cursor-pointer hover:text-white' : ''}`}
            onClick={onClick}
        >
            {children}
        </div>
    );
};

interface InputWrapperProps {
    children: React.ReactNode;
    className?: string;
}

const InputWrapper: React.FC<InputWrapperProps> = ({ children, className = '' }) => {
    return (
        <div className={`relative ${className}`}>
            {children}
        </div>
    );
};

interface InputGroupProps {
    children: React.ReactNode;
    className?: string;
}

const InputGroup: React.FC<InputGroupProps> = ({ children, className = '' }) => {
    return (
        <div className={`space-y-6 ${className}`}>
            {children}
        </div>
    );
};

export const Input = {
    Root: InputRoot,
    Icon: InputIcon,
    Wrapper: InputWrapper,
    Group: InputGroup
};