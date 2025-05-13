import React from 'react';
import './ProgressBar.css';

/**
 * ProgressBar Component - A customizable horizontal progress bar with animations
 * 
 * Features:
 * - Responsive sizing (small, medium, large)
 * - Customizable colors for bar and background
 * - Smooth animations for progress updates
 * - Completion pulse animation when reaching 100%
 * - Optional percentage text display
 * - Full accessibility support (ARIA attributes)
 * - Theme support (light/dark)
 * 
 * @param {Object} props - Component properties
 * @param {number} [props.percentage=0] - Current progress percentage (0-100)
 * @param {('small'|'medium'|'large')} [props.size='medium'] - Size variant of the progress bar
 * @param {string} [props.barColor] - Custom color for the progress bar fill (overrides CSS variable)
 * @param {string} [props.backgroundColor] - Custom color for the progress bar background (overrides CSS variable)
 * @param {boolean} [props.animated=true] - Whether to enable progress animations
 * @param {boolean} [props.showPercentage=false] - Whether to display percentage text
 * @param {string} [props.className=''] - Additional CSS classes to apply
 * 
 * @example
 * // Basic usage
 * <ProgressBar percentage={75} />
 * 
 * @example
 * // Customized progress bar
 * <ProgressBar 
 *   percentage={42}
 *   size="large"
 *   barColor="#4CAF50"
 *   animated={false}
 *   showPercentage={true}
 * />
 * 
 * @returns {React.ReactElement} A fully accessible progress bar component
 */
const ProgressBar = ({
  percentage = 0,
  size = 'medium',
  barColor,
  backgroundColor,
  animated = true,
  showPercentage = false,
  className = '',
}) => {
  // Clamp percentage value between 0 and 100 to ensure valid range
  const validPercentage = Math.min(Math.max(percentage, 0), 100);
  
  // Check if progress has reached completion (100%)
  const isComplete = validPercentage === 100;
  
  // Dynamically build CSS classes based on props
  const progressBarClasses = [
    'progress-bar-container', // Base class
    `progress-bar-${size}`,  // Size variant
    animated ? 'progress-bar-animated' : '', // Animation toggle
    isComplete ? 'progress-bar-complete' : '', // Completion state
    className // Additional custom classes
  ].filter(Boolean).join(' ');

  // Inline styles for dynamic color customization
  const barStyle = {
    width: `${validPercentage}%`, // Set width based on percentage
    ...(barColor && { backgroundColor: barColor }), // Custom bar color if provided
  };

  const containerStyle = {
    ...(backgroundColor && { backgroundColor }), // Custom background color if provided
  };

  return (
    <div className="progress-bar-wrapper">
      {/* Progress bar container with ARIA attributes for accessibility */}
      <div 
        className={progressBarClasses}
        style={containerStyle}
        role="progressbar"
        aria-valuenow={validPercentage}
        aria-valuemin="0"
        aria-valuemax="100"
        aria-label={`Progress: ${validPercentage}%`}
      >
        {/* Progress bar fill element */}
        <div 
          className="progress-bar-fill"
          style={barStyle}
        >
          {/* Completion pulse animation (only shows at 100% with animations enabled) */}
          {isComplete && animated && (
            <div className="progress-bar-complete-pulse" aria-hidden="true"></div>
          )}
        </div>
      </div>
      
      {/* Optional percentage text display */}
      {showPercentage && (
        <span className="progress-bar-percentage">
          {validPercentage}%
        </span>
      )}
    </div>
  );
};

export default ProgressBar;
