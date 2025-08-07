import React from "react";
import "./TextInput.css";

interface TextInputProps {
  name: string;
  placeholder?: string;
  value?: string | number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  id?: string;
  disabled?: boolean;
  required?: boolean;
  autoComplete?: string;
  className?: string;
  defaultValue?: string | number;
}

const TextInput: React.FC<TextInputProps> = ({
  name,
  placeholder,
  value,
  onChange,
  type = "text",
  id,
  disabled = false,
  required = false,
  autoComplete,
  className,
  defaultValue,
}) => {
  return (
    <input
      className={
        className
          ? className
          : type === "date"
          ? "TextInput-input TextInput-date"
          : "TextInput-input"
      }
      type={type}
      name={name}
      id={id}
      placeholder={placeholder}
      {...(value !== undefined
        ? { value, onChange }
        : { defaultValue, onChange })}
      disabled={disabled}
      required={required}
      autoComplete={autoComplete}
    />
  );
};

export default TextInput;
