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
                        className="block text-sm font-medium text-gray-300 mb-2"
                    >
                        {label}
                    </label>
                )}
                <input
                    ref={ref}
                    id={inputId}
                    className={`
                        w-full px-4 py-2.5
                        bg-[#0F1419]
                        border ${error ? 'border-red-500 focus:border-red-500' : 'border-[#252A31] focus:border-[#00D4FF]'}
                        rounded-lg
                        text-white placeholder:text-gray-500
                        focus:outline-none focus:ring-2 ${error ? 'focus:ring-red-500/20' : 'focus:ring-[#00D4FF]/20'}
                        transition-all duration-200
                        disabled:opacity-50 disabled:cursor-not-allowed
                        ${className}
                    `}
                    {...props}
                />
                {error && (
                    <p className="mt-1.5 text-sm text-red-400 flex items-center gap-1.5">
                        <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
        <div className={`space-y-4 ${className}`}>
            {children}
        </div>
    );
};

export const Input = {
    Root: InputRoot,
    Wrapper: InputWrapper,
    Group: InputGroup
};