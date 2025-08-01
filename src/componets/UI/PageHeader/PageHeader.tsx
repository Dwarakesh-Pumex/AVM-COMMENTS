import React, { useState } from 'react';
import './PageHeader.css';
import ProfileDropdownMenu from '../ProfileDropdownMenu/ProfileDropdownMenu';
import FilterDropdown from '../FilterDropdown/FilterDropdown';
import { LiaFilterSolid } from 'react-icons/lia';
import { MdRefresh } from 'react-icons/md';
import { TbLayoutGridFilled } from 'react-icons/tb';
import { FaList } from 'react-icons/fa6';
import ProfileIcon from "../../../assets/images/header/searchbar_profile-icon.svg";
import SearchIcon from "../../../assets/images/header/searchbar_magnifier_icon.svg";
import Cookies from 'js-cookie';

interface Stage {
  id: string;
  label: string;
  ariaLabel: string;
}

interface Button {
  label: string;
  onClick: () => void;
  icon?: React.ReactNode;
  className?: string;
}

interface Filter {
  title: string;
  options: { id: string; label: string }[];
  selectedOptions: string[];
  onSelectionChange: (selectedIds: string[]) => void;
  placeholder?: string;
  multiselect?: boolean;
  showSearchInput?: boolean;
  isDateFilter?: boolean;
}

interface PageHeaderProps {
  title: string;
  stages?: Stage[];
  buttons?: Button[];
  filters?: Filter[];
  showGridOption?: boolean;
  showHeaderRow1Only?: boolean;
  showSearchBar?: boolean;
  onStageChange?: (stageId: string) => void;
  onViewToggle?: (isListView: boolean) => void;
  onApplyFilters?: () => void;
  onClearFilters?: () => void;
  onSearchChange?: (searchTerm: string) => void;
}

const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  stages = [],
  buttons = [],
  filters = [],
  showGridOption = false,
  showHeaderRow1Only = false,
  showSearchBar = false, 
  onStageChange,
  onViewToggle,
  onApplyFilters,
  onClearFilters,
  onSearchChange,
}) => {
  const [isFilterSelected, setIsFilterSelected] = useState(false);
  const [showFilterOptions, setShowFilterOptions] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [isListView, setIsListView] = useState(true);
  const [selectedStage, setSelectedStage] = useState(stages[0]?.id || '');
  const [searchTerm, setSearchTerm] = useState('');

  const fullName = Cookies.get('fullname');

  const handleFilterToggle = () => {
    setIsFilterSelected(!isFilterSelected);
    setShowFilterOptions(!isFilterSelected);
    if (!isFilterSelected && onClearFilters) {
      onClearFilters();
    }
  };

  const handleProfileToggle = () => {
    setShowProfileDropdown(!showProfileDropdown);
  };

  const handleViewToggle = () => {
    const newView = !isListView;
    setIsListView(newView);
    onViewToggle?.(newView);
  };

  const handleStageClick = (stageId: string) => {
    setSelectedStage(stageId);
    onStageChange?.(stageId);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase();
    setSearchTerm(value);
    onSearchChange?.(value);
  };

  if (showHeaderRow1Only) {
    return (
      <div className="header-main-container">
        <div className="header-row-1">
          <div className="header-main-container-left-div">
            <h1>{title}</h1>
          </div>
          <div className="header-main-container-right-div">
            <div className="header-main-container-right-div-profile">
              <h3>{fullName}</h3>
              <img
                src={ProfileIcon}
                alt="Profile Icon"
                className="profile-icon"
                onClick={handleProfileToggle}
                style={{ cursor: 'pointer' }}
              />
              <ProfileDropdownMenu show={showProfileDropdown} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`header-main-container ${showFilterOptions ? 'filters-shown' : ''}`}>
      <div className="header-row-1">
        <div className="header-main-container-left-div">
          <h1>{title}</h1>
        </div>
        <div className="header-main-container-right-div">
          <div className="header-main-container-right-div-profile">
            <h3>{fullName}</h3>
            <img
              src={ProfileIcon}
              alt="Profile Icon"
              className="profile-icon"
              onClick={handleProfileToggle}
              style={{ cursor: 'pointer' }}
            />
            <ProfileDropdownMenu show={showProfileDropdown} />
          </div>
        </div>
      </div>

      <div className="header-row-2">
        <div className="header-main-container-left-div">
          {stages.length > 0 && (
            <div className="header-stages-container">
              {stages.map((stage) => (
                <div
                  key={stage.id}
                  className={`header-stage ${selectedStage === stage.id ? 'active' : ''}`}
                  aria-label={stage.ariaLabel}
                  onClick={() => handleStageClick(stage.id)}
                >
                  {stage.label}
                </div>
              ))}
            </div>
          )}
          {showGridOption && (
            <div className="header-listing-option" onClick={handleViewToggle}>
              {isListView ? <FaList /> : <TbLayoutGridFilled />}
            </div>
          )}
        </div>

        <div className="header-main-container-right-div">
          <div className="header-buttons-container">
            {showSearchBar && (
              <div className="header-searchbar-div">
                <img
                  src={SearchIcon}
                  alt="Search Icon"
                  className="header-searchbar-icon"
                />
                <input
                  type="text"
                  className="header-searchbar-input"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
              </div>
            )}
            {filters.length > 0 && (
              <button
                className={`header-button header-filter-btn ${isFilterSelected ? 'selected' : ''}`}
                onClick={handleFilterToggle}
                aria-label={isFilterSelected ? 'Hide filters' : 'Show filters'}
              >
                <LiaFilterSolid />
              </button>
            )}
            {buttons.map((button, index) => (
              <button
                key={index}
                className={`header-button ${button.className || ''} ${button.icon ? 'icon-button' : ''}`}
                onClick={button.onClick}
              >
                {button.icon && <span className="button-icon">{button.icon}</span>}
                {button.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {showFilterOptions && filters.length > 0 && (
        <div className="header-row-3">
          <div className="header-main-container-left-div"></div>
          <div className="header-main-container-right-div">
            <div className="header-filter-options-container">
              {filters.map((filter, index) => (
                <FilterDropdown
                  key={index}
                  title={filter.title}
                  options={filter.options}
                  selectedOptions={filter.selectedOptions}
                  onSelectionChange={filter.onSelectionChange}
                  placeholder={filter.placeholder}
                  multiselect={filter.multiselect}
                  showSearchInput={filter.showSearchInput}
                  isDateFilter={filter.isDateFilter}
                />
              ))}
              {onClearFilters && (
                <button className="header-filter-clear-btn" onClick={onClearFilters}>
                  <MdRefresh />
                </button>
              )}
              {onApplyFilters && (
                <button className="header-filter-apply-btn" onClick={onApplyFilters}>
                  Apply
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PageHeader;