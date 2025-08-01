import React, { useState, useRef, useEffect } from 'react';
import './FilterDropdown.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

interface FilterOption {
  id: string;
  label: string;
}

interface FilterDropdownProps {
  title: string;
  options: FilterOption[];
  selectedOptions: string[];
  onSelectionChange: (selectedIds: string[]) => void;
  placeholder?: string;
  multiselect?: boolean;
  showSearchInput?: boolean;
  isDateFilter?: boolean;
}

const FilterDropdown: React.FC<FilterDropdownProps> = ({
  title,
  options,
  selectedOptions,
  onSelectionChange,
  placeholder = "Search...",
  multiselect = false,
  showSearchInput = true,
  isDateFilter = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [startDate, setStartDate] = useState<Date | null>(
    selectedOptions[0] ? new Date(selectedOptions[0]) : null
  );
  const [endDate, setEndDate] = useState<Date | null>(
    selectedOptions[1] ? new Date(selectedOptions[1]) : null
  );
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isDateFilter) {
      setStartDate(selectedOptions[0] ? new Date(selectedOptions[0]) : null);
      setEndDate(selectedOptions[1] ? new Date(selectedOptions[1]) : null);
    }
  }, [selectedOptions, isDateFilter]);

  const filteredOptions = showSearchInput && !isDateFilter
    ? options.filter(option =>
        option.label.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : options;

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionSelect = (optionId: string) => {
    let newSelectedOptions: string[];
    if (multiselect) {
      newSelectedOptions = selectedOptions.includes(optionId)
        ? selectedOptions.filter(id => id !== optionId)
        : [...selectedOptions, optionId];
    } else {
      newSelectedOptions = [optionId];
    }
    onSelectionChange(newSelectedOptions);
    if (!multiselect) {
      setIsOpen(false);
    }
  };

const formatDateToISO = (date: Date | null, isEndDate: boolean = false): string => {
    if (!date) return '';
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const time = isEndDate ? '23:59:59' : '00:00:00';
    return `${year}-${month}-${day}T${time}Z`;
  };

  const handleDateChange = (date: Date | null, type: 'start' | 'end') => {
    if (type === 'start') {
      setStartDate(date);
      const dateString = formatDateToISO(date, false);
      const endDateString = selectedOptions[1] || formatDateToISO(endDate, true);
      onSelectionChange([dateString, endDateString].filter(Boolean));
    } else {
      setEndDate(date);
      const startDateString = selectedOptions[0] || formatDateToISO(startDate, false);
      const dateString = formatDateToISO(date, true);
      onSelectionChange([startDateString, dateString].filter(Boolean));
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleClearDates = () => {
    setStartDate(null);
    setEndDate(null);
    onSelectionChange([]);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

 

  return (
    <div className="filter-dropdown-container" ref={dropdownRef}>
      <div className="filter-dropdown-trigger" onClick={handleToggle}>
        <span className="filter-dropdown-title">
          {title}
          
        </span>
        {(isDateFilter && (startDate || endDate)) || (!isDateFilter && selectedOptions.length > 0) ? (
  <span className="filter-dropdown-count">
    {!isDateFilter && selectedOptions.length}
  </span>
) : null}
        <span className={`filter-dropdown-arrow ${isOpen ? 'open' : ''}`}>▾</span>
      </div>
      {isOpen && (
        <div className="filter-dropdown-menu">
          {isDateFilter ? (
            <div className="filter-dropdown-date-container">
              <div className="filter-dropdown-date-pickers">
                <div className="filter-dropdown-date-picker-wrapper">
                  <label className="filter-dropdown-date-label">Start Date:</label>
                  <DatePicker
                    selected={startDate}
                    onChange={(date: Date | null) => handleDateChange(date, 'start')}
                    placeholderText="Select start date"
                    className="filter-dropdown-search-input"
                    dateFormat="dd/MM/yyyy"
                    selectsStart
                    startDate={startDate}
                    endDate={endDate}
                    maxDate={endDate || undefined}
                    wrapperClassName="custom-datepicker-wrapper"
                    popperClassName="custom-datepicker"
                    calendarClassName="custom-datepicker"
                  />
                </div>
                <div className="filter-dropdown-date-picker-wrapper">
                  <label className="filter-dropdown-date-label">End Date:</label>
                  <DatePicker
                    selected={endDate}
                    onChange={(date: Date | null) => handleDateChange(date, 'end')}
                    placeholderText="Select end date"
                    className="filter-dropdown-search-input"
                    dateFormat="dd/MM/yyyy"
                    selectsEnd
                    startDate={startDate}
                    endDate={endDate}
                    minDate={startDate || undefined}
                    wrapperClassName="custom-datepicker-wrapper"
                    popperClassName="custom-datepicker"
                    calendarClassName="custom-datepicker"
                  />
                </div>
              </div>
              {(startDate || endDate) && (
                <div className="filter-dropdown-date-actions">
                  <button 
                    className="filter-dropdown-clear-dates-btn"
                    onClick={handleClearDates}
                  >
                    Clear Dates
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              {showSearchInput && (
                <div className="filter-dropdown-search">
                  <input
                    type="text"
                    placeholder={placeholder}
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="filter-dropdown-search-input"
                  />
                </div>
              )}
              <div className="filter-dropdown-options">
                {filteredOptions.map(option => (
                  <div
                    key={option.id}
                    className="filter-dropdown-option"
                    onClick={() => handleOptionSelect(option.id)}
                  >
                    <div className="filter-dropdown-checkbox">
                      <div className={`checkbox-square ${selectedOptions.includes(option.id) ? 'checked' : ''}`}>
                        {selectedOptions.includes(option.id) && <span className="checkbox-tick">✓</span>}
                      </div>
                    </div>
                    <span className="filter-dropdown-option-label">{option.label}</span>
                  </div>
                ))}
                {filteredOptions.length === 0 && (
                  <div className="filter-dropdown-no-results">No results found</div>
                )}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default FilterDropdown;