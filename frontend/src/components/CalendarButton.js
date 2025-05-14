import React from 'react';
import { useNavigate } from 'react-router-dom';
import './CalendarButton.css';

function CalendarButton() {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/calendar');
  };

  return (
    <button 
      className="calendar-button" 
      onClick={handleClick}
      aria-label="Calendar"
    >
      {/* Calendar icon */}
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
        <line x1="16" y1="2" x2="16" y2="6"></line>
        <line x1="8" y1="2" x2="8" y2="6"></line>
        <line x1="3" y1="10" x2="21" y2="10"></line>
      </svg>
    </button>
  );
}

export default CalendarButton;
