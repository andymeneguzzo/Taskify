import React, { useState, useRef, useEffect } from 'react';
import './CustomDropdown.css';

const CustomDropdown = ({ 
  options, 
  value, 
  onChange, 
  name, 
  label, 
  disabled = false,
  required = false,
  id
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const dropdownRef = useRef(null);
  
  // Find the selected option
  const selectedOption = options.find(option => option.value === value) || options[0];
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Reset highlighted index when dropdown opens
  useEffect(() => {
    if (isOpen) {
      const index = options.findIndex(option => option.value === value);
      setHighlightedIndex(index >= 0 ? index : 0);
    }
  }, [isOpen, options, value]);
  
  const handleOptionClick = (option) => {
    if (disabled) return;
    
    onChange({ 
      target: { 
        name, 
        value: option.value 
      } 
    });
    
    setIsOpen(false);
  };
  
  const handleKeyDown = (e) => {
    if (disabled) return;
    
    // Handle various key events for accessibility
    switch (e.key) {
      case 'Enter':
      case ' ':
        e.preventDefault();
        if (isOpen) {
          handleOptionClick(options[highlightedIndex]);
        } else {
          setIsOpen(true);
        }
        break;
      case 'Escape':
        e.preventDefault();
        setIsOpen(false);
        break;
      case 'ArrowUp':
        e.preventDefault();
        if (isOpen) {
          setHighlightedIndex(prev => (prev > 0 ? prev - 1 : prev));
        } else {
          setIsOpen(true);
        }
        break;
      case 'ArrowDown':
        e.preventDefault();
        if (isOpen) {
          setHighlightedIndex(prev => (prev < options.length - 1 ? prev + 1 : prev));
        } else {
          setIsOpen(true);
        }
        break;
      default:
        break;
    }
  };

  return (
    <div className="form-group custom-dropdown-container" ref={dropdownRef}>
      {label && (
        <label htmlFor={id || name}>
          {label}
          {required && <span className="required-marker">*</span>}
        </label>
      )}
      
      <div 
        className={`custom-dropdown ${isOpen ? 'open' : ''} ${disabled ? 'disabled' : ''}`}
        onClick={() => !disabled && setIsOpen(prev => !prev)}
        onKeyDown={handleKeyDown}
        tabIndex={disabled ? -1 : 0}
        role="combobox"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-labelledby={label ? `${id || name}-label` : undefined}
        id={id || name}
      >
        <div className="selected-option">
          <span>{selectedOption?.label || ''}</span>
          <div className="dropdown-arrow"></div>
        </div>
        
        {isOpen && (
          <ul className="options-list" role="listbox">
            {options.map((option, index) => (
              <li 
                key={option.value}
                className={`option-item ${option.value === value ? 'selected' : ''} ${index === highlightedIndex ? 'highlighted' : ''}`}
                onClick={(e) => {
                  e.stopPropagation();
                  handleOptionClick(option);
                }}
                role="option"
                aria-selected={option.value === value}
              >
                {option.label}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default CustomDropdown;
