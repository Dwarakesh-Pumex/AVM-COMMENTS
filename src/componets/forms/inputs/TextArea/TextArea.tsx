import React from 'react';
import './TextArea.css';

interface TextAreaProps {
  name: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  id?: string;
  disabled?: boolean;
  required?: boolean;
  rows?: number;
  cols?: number;
  autoComplete?: string;
  className?: string;
}

const TextArea: React.FC<TextAreaProps> = ({
  name,
  placeholder,
  value,
  onChange,
  id,
  disabled = false,
  required = false,
  rows = 4,
  cols,
  autoComplete,
  className,
}) => {
  return (
    <textarea
      className={`TextArea-input ${className || ''}`}
      name={name}
      id={id}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      disabled={disabled}
      required={required}
      rows={rows}
      cols={cols}
      autoComplete={autoComplete}
    />
  );
};

export default TextArea;