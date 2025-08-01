import React, { useState, useEffect, useRef } from 'react';
import './PasswordInput.css';

interface PasswordInputProps {
  name: string;
  placeholder?: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  id?: string;
  disabled?: boolean;
  required?: boolean;
  autoComplete?: string;
  className?: string;
}

const PasswordInput: React.FC<PasswordInputProps> = ({
  name,
  placeholder,
  value,
  onChange,
  id,
  disabled = false,
  required = false,
  autoComplete,
  className,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const togglePasswordVisibility = (e: React.MouseEvent | React.KeyboardEvent) => {
    e.stopPropagation(); // Prevent the click from bubbling to the document
    setShowPassword(!showPassword);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowPassword(false);
      }
    };

    if (showPassword) {
      document.addEventListener('click', handleClickOutside);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [showPassword]);

  return (
    <div className="PasswordInput-container" ref={containerRef}>
      <input
        className={className ? className : 'PasswordInput-input'}
        type={showPassword ? 'text' : 'password'}
        name={name}
        id={id}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        required={required}
        autoComplete={autoComplete}
      />
      <span
        className="PasswordInput-toggle"
        onClick={togglePasswordVisibility}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            togglePasswordVisibility(e);
          }
        }}
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#9EA3A2"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {showPassword ? (
            <>
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
              <circle cx="12" cy="12" r="3" />
            </>
          ) : (
            <>
              <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
              <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
              <path d="M1 1l22 22" />
              <circle cx="12" cy="12" r="3" />
            </>
          )}
        </svg>
      </span>
    </div>
  );
};

export default PasswordInput;