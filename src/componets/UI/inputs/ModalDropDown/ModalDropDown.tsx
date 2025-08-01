import { useState, useRef, useEffect } from "react";
import "./ModalDropDown.css";

export interface FilterOption {
  label: string;
  value: string;
}

interface ModalDropDownProps {
  name: string;
  label?: string;
  options?: FilterOption[];
  placeholder?: string;
  required?: boolean;
  isSearchable?: boolean;
  isClearable?: boolean;
  isDisabled?: boolean;
  isMulti?: boolean;
  value?: FilterOption[];
  defaultValue?: string | FilterOption[];
  onChange?: (selected: FilterOption[], name?: string) => void;
  clearTrigger?: number | boolean;
}

const ModalDropDown = ({
  name,
  label,
  options = [],
  placeholder = "Select...",
  required = false,
  isSearchable = true,
  isClearable = true,
  isDisabled = false,
  isMulti = false,
  value,
  defaultValue,
  onChange,
  clearTrigger,
}: ModalDropDownProps) => {
  const [internalValue, setInternalValue] = useState<FilterOption[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOptions = value !== undefined ? value : internalValue;

  const toggleDropdown = () => {
    if (!isDisabled) setIsOpen((prev) => !prev);
  };

  const updateSelectedOptions = (newSelected: FilterOption[]) => {
    if (value === undefined) setInternalValue(newSelected);
    onChange?.(newSelected, name);
  };

  const handleOptionClick = (option: FilterOption) => {
    if (isMulti) {
      const exists = selectedOptions.some((o) => o.value === option.value);
      const newSelected = exists
        ? selectedOptions.filter((o) => o.value !== option.value)
        : [...selectedOptions, option];
      updateSelectedOptions(newSelected);
    } else {
      updateSelectedOptions([option]);
      setIsOpen(false);
    }
  };

  const clearAll = () => {
    updateSelectedOptions([]);
    setSearchTerm("");
  };

  const prevClearTriggerRef =
    useRef<ModalDropDownProps["clearTrigger"]>(undefined);

  useEffect(() => {
    if (
      clearTrigger !== undefined &&
      clearTrigger !== prevClearTriggerRef.current
    ) {
      clearAll();
      prevClearTriggerRef.current = clearTrigger;
    }
  }, [clearTrigger]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (value !== undefined) {
      setInternalValue(value);
    }
  }, [value]);

  useEffect(() => {
    if (value !== undefined || !defaultValue || options.length === 0) return;

    if (typeof defaultValue === "string") {
      const match = options.find((opt) => opt.value === defaultValue);
      if (match) {
        setInternalValue([match]);
        onChange?.([match], name);
      }
    } else if (Array.isArray(defaultValue)) {
      const matched = defaultValue
        .map((def) => options.find((opt) => opt.value === def.value))
        .filter(Boolean) as FilterOption[];
      if (matched.length) {
        setInternalValue(matched);
        onChange?.(matched, name);
      }
    }
  }, [defaultValue, name, onChange, options, value]);

  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="dropdown-wrapper">
      {label && (
        <label className="dropdown-label">
          {label}
          {required && <span className="required">*</span>}
        </label>
      )}

      <div className="dropdown-container" ref={containerRef}>
        <div
          className={`dropdown-control${
            isDisabled ? " dropdown-disabled" : ""
          }`}
          onClick={toggleDropdown}
        >
          <div id={name} className="dropdown-values">
            {selectedOptions.length === 0 ? (
              <span  className="dropdown-placeholder">
                {placeholder}
              </span>
            ) : isMulti ? (
              selectedOptions.map((opt) => (
                <span key={opt.value} className="dropdown-badge">
                  {opt.label}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      updateSelectedOptions(
                        selectedOptions.filter((o) => o.value !== opt.value)
                      );
                    }}
                    className="remove-btn"
                  >
                    ×
                  </button>
                </span>
              ))
            ) : (
              <span className="dropdown-single">
                {selectedOptions[0].label}
              </span>
            )}
          </div>
          {isClearable && selectedOptions.length > 0 && (
            <button
              className="clear-btn"
              onClick={(e) => {
                e.stopPropagation();
                clearAll();
              }}
            >
              ×
            </button>
          )}
          <div className="dropdown-caret">▾</div>
        </div>

        {!isDisabled && isOpen && (
          <div className="dropdown-menu">
            {isSearchable && (
              <input
                type="text"
                className="dropdown-search"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            )}
            <ul className="dropdown-options">
              {filteredOptions.length === 0 ? (
                <li className="dropdown-no-options">No options</li>
              ) : (
                filteredOptions.map((option) => (
                  <li
                    key={option.value}
                    className={`dropdown-option ${
                      selectedOptions.some((o) => o.value === option.value)
                        ? "selected"
                        : ""
                    }`}
                    onClick={() => handleOptionClick(option)}
                  >
                    {option.label}
                  </li>
                ))
              )}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default ModalDropDown;
