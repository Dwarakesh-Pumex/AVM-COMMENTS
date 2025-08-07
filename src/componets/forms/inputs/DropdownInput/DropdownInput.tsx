import React from 'react';
import './DropdownInput.css';

interface DropdownInputProps {
  name: string;
  placeholder: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: { value: string | number; label: string }[];
  id?: string;
  disabled?: boolean;
  required?: boolean;
  className?: string;
}

const DropdownInput: React.FC<DropdownInputProps> = ({
  name,
  value,
  onChange,
  options,
  id,
  disabled = false,
  required = false,
  className,
  placeholder,
}) => {
  return (
    <select
      className={`DropdownInput ${className || ''}`}
      name={name}
      id={id}
      value={value}
      onChange={onChange}
      disabled={disabled}
      required={required}
    >
      <option value="" disabled hidden>
        {placeholder}
      </option>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};

export default DropdownInput;