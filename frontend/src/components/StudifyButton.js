import React from 'react';
import { useNavigate } from 'react-router-dom';
import './StudifyButton.css';

function StudifyButton() {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/studify');
  };

  return (
    <button 
      className="studify-button" 
      onClick={handleClick}
      aria-label="Studify"
    >
      {/* Books icon */}
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
      </svg>
    </button>
  );
}

export default StudifyButton;
