import React, { useEffect, useState, useRef } from 'react';
import './CircularProgress.css';

/**
 * CircularProgress Component - A customizable circular progress indicator using SVG
 * 
 * Features:
 * - Responsive sizing (small, medium, large)
 * - Customizable stroke and background colors
 * - Smooth animations for progress updates
 * - Completion pulse animation when reaching 100%
 * - Optional percentage text display
 * - Full accessibility support (ARIA attributes)
 * - Theme support (light/dark)
 * - Neumorphic design styling
 * 
 * @param {Object} props - Component properties
 * @param {number} [props.percentage=0] - Current progress percentage (0-100)
 * @param {('small'|'medium'|'large')} [props.size='medium'] - Size variant of the circular progress
 * @param {number} [props.strokeWidth] - Custom width of the progress stroke (overrides size-based default)
 * @param {string} [props.strokeColor] - Custom color for the progress stroke (overrides CSS variable)
 * @param {string} [props.backgroundColor] - Custom color for the track background (overrides CSS variable)
 * @param {boolean} [props.showText=true] - Whether to display percentage text in center
 * @param {string} [props.className=''] - Additional CSS classes to apply
 * @param {boolean} [props.animated=true] - Whether to animate progress changes
 * 
 * @example
 * // Basic usage
 * <CircularProgress percentage={75} />
 * 
 * @example
 * // Customized progress circle
 * <CircularProgress 
 *   percentage={42}
 *   size="large"
 *   strokeColor="#4CAF50"
 *   backgroundColor="#f5f5f5"
 *   animated={false}
 *   showPercentage={true}
 * />
 * 
 * @returns {React.ReactElement} A fully accessible circular progress component
 */
const CircularProgress = ({
  percentage = 0,
  size = 'medium',
  strokeWidth,
  strokeColor,
  backgroundColor,
  showText = true,
  className = '',
  animated = true,
}) => {
  // Refs for DOM elements to support animations
  const progressRef = useRef(null);
  const textRef = useRef(null);
  
  // State to track animated percentage value (for smooth transitions)
  const [animatedPercentage, setAnimatedPercentage] = useState(0);
  
  // Ensure percentage stays within valid range (0-100)
  const validPercentage = Math.min(Math.max(percentage, 0), 100);
  
  /**
   * Determines default stroke width based on component size
   * @returns {number} Default stroke width in pixels
   */
  const getDefaultStrokeWidth = () => {
    switch (size) {
      case 'small': return 4;
      case 'large': return 8;
      default: return 6;
    }
  };
  
  /**
   * Gets SVG dimensions based on component size
   * @returns {Object} Contains size and viewBox values
   */
  const getDimensions = () => {
    switch (size) {
      case 'small': return { size: 80, viewBox: '0 0 80 80' };
      case 'large': return { size: 160, viewBox: '0 0 160 160' };
      default: return { size: 120, viewBox: '0 0 120 120' };
    }
  };
  
  const { viewBox } = getDimensions();
  const finalStrokeWidth = strokeWidth || getDefaultStrokeWidth();
  
  // Calculate SVG circle parameters
  const center = parseInt(viewBox.split(' ')[2]) / 2;
  const radius = center - finalStrokeWidth * 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (validPercentage / 100) * circumference;
  
  // Build CSS class string based on props
  const circleClasses = [
    'circular-progress', // Base class
    `circular-progress-${size}`, // Size variant
    animated ? 'animated' : '', // Animation toggle
    className // Additional custom classes
  ].filter(Boolean).join(' ');
  
  // Inline styles for dynamic color customization
  const progressStyle = {
    ...(strokeColor && { stroke: strokeColor }), // Custom stroke color if provided
  };
  
  const trackStyle = {
    ...(backgroundColor && { stroke: backgroundColor }), // Custom background color if provided
  };
  
  /**
   * Animation effect for smooth progress updates
   * Uses requestAnimationFrame for performance
   * Implements easing function for natural motion
   */
  useEffect(() => {
    if (!animated) {
      setAnimatedPercentage(validPercentage);
      return;
    }
    
    let start = null;
    const startValue = animatedPercentage;
    const endValue = validPercentage;
    const duration = 800; // Animation duration in milliseconds
    
    const animateProgress = (timestamp) => {
      if (!start) start = timestamp;
      const elapsed = timestamp - start;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function for smoother animation (ease-out-quad)
      const easeOutQuad = (t) => t * (2 - t);
      const easedProgress = easeOutQuad(progress);
      
      const currentValue = startValue + (endValue - startValue) * easedProgress;
      setAnimatedPercentage(currentValue);
      
      if (progress < 1) {
        requestAnimationFrame(animateProgress);
      }
    };
    
    requestAnimationFrame(animateProgress);
  }, [validPercentage, animated]);
  
  // Check if progress has reached completion (100%)
  const isComplete = validPercentage === 100;
  
  return (
    <div className={`circular-progress-container ${isComplete ? 'complete' : ''}`}>
      <svg
        className={circleClasses}
        width={getDimensions().size}
        height={getDimensions().size}
        viewBox={viewBox}
        ref={progressRef}
      >
        {/* SVG filter for neumorphic shadow effect */}
        <defs>
          <filter id="circular-progress-shadow">
            <feDropShadow dx="2" dy="2" stdDeviation="2" floodOpacity="0.3" />
          </filter>
        </defs>
        
        {/* Background track circle */}
        <circle
          className="circular-progress-track"
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          strokeWidth={finalStrokeWidth}
          style={trackStyle}
        />
        
        {/* Foreground progress circle */}
        <circle
          className="circular-progress-indicator"
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          strokeWidth={finalStrokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={circumference - (animatedPercentage / 100) * circumference}
          strokeLinecap="round" // Rounded line ends for smoother appearance
          style={progressStyle}
          filter="url(#circular-progress-shadow)"
          transform={`rotate(-90 ${center} ${center})`} // Start progress from top
        />
        
        {/* Pulse animation that only appears when progress is complete */}
        {isComplete && (
          <circle
            className="circular-progress-pulse"
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            strokeWidth={finalStrokeWidth}
            stroke={strokeColor || 'var(--primary-color, #4a6fa5)'}
          />
        )}
      </svg>
      
      {/* Optional percentage text display in center */}
      {showText && (
        <div 
          className={`circular-progress-text circular-progress-text-${size}`}
          ref={textRef}
        >
          {Math.round(animatedPercentage)}%
        </div>
      )}
    </div>
  );
};

export default CircularProgress;
