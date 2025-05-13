import React, { useEffect, useRef, useState } from 'react';
import './Confetti.css';

/**
 * Confetti Component
 * 
 * A celebration animation that displays confetti particles when triggered
 * 
 * @param {Object} props
 * @param {boolean} props.active - Whether the confetti should be active
 * @param {number} props.duration - How long the animation should last in ms (default: 3000)
 * @param {string} props.colors - Array of colors for confetti particles
 * @param {number} props.particleCount - Number of confetti particles to generate
 */
const Confetti = ({ 
  active = false, 
  duration = 3000, 
  colors = ['#f44336', '#e91e63', '#9c27b0', '#673ab7', '#3f51b5', '#2196f3', '#03a9f4', '#00bcd4', '#009688', '#4CAF50'], 
  particleCount = 150 
}) => {
  const canvasRef = useRef(null);
  const [particles, setParticles] = useState([]);
  const [animationFrame, setAnimationFrame] = useState(null);
  const [isActive, setIsActive] = useState(active);
  
  // Create confetti particles when activated
  useEffect(() => {
    if (active && !isActive) {
      setIsActive(true);
      
      // Create particles
      const newParticles = [];
      
      for (let i = 0; i < particleCount; i++) {
        newParticles.push({
          color: colors[Math.floor(Math.random() * colors.length)],
          x: Math.random() * window.innerWidth,
          y: -20 - Math.random() * 100,
          size: 5 + Math.random() * 10,
          tilt: Math.random() * 10 - 5,
          tiltAngleIncrement: Math.random() * 0.1 + 0.05,
          tiltAngle: 0,
          velocity: {
            x: Math.random() * 6 - 3,
            y: Math.random() * 3 + 2
          },
          rotation: Math.random() * 360,
          rotationSpeed: Math.random() * 2 - 1
        });
      }
      
      setParticles(newParticles);
      
      // Set a timeout to stop the animation
      const timer = setTimeout(() => {
        setIsActive(false);
      }, duration);
      
      return () => clearTimeout(timer);
    }
  }, [active, colors, duration, isActive, particleCount]);
  
  // Animation loop
  useEffect(() => {
    if (!isActive || !canvasRef.current) {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
      return;
    }
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Set canvas size
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const updatedParticles = [...particles];
      let shouldContinue = false;
      
      updatedParticles.forEach((particle, index) => {
        // Only render if particle is within view
        if (particle.y < canvas.height + 20) {
          shouldContinue = true;
          
          // Update position
          particle.x += particle.velocity.x;
          particle.y += particle.velocity.y;
          
          // Apply gravity
          particle.velocity.y += 0.1;
          
          // Update tilt
          particle.tiltAngle += particle.tiltAngleIncrement;
          particle.tilt = Math.sin(particle.tiltAngle) * 15;
          
          // Update rotation
          particle.rotation += particle.rotationSpeed;
          
          // Draw confetti
          ctx.save();
          ctx.translate(particle.x, particle.y);
          ctx.rotate(particle.rotation * Math.PI / 180);
          
          ctx.fillStyle = particle.color;
          ctx.beginPath();
          
          if (Math.random() > 0.5) {
            // Rectangle
            ctx.fillRect(-particle.size / 2, -particle.size / 2, particle.size, particle.size / 2);
          } else {
            // Circle/ellipse
            ctx.ellipse(0, 0, particle.size / 2, particle.size / 4, 0, 0, 2 * Math.PI);
            ctx.fill();
          }
          
          ctx.restore();
          
          // Update particle in array
          updatedParticles[index] = particle;
        }
      });
      
      // Continue animation if particles are still visible
      if (shouldContinue) {
        setParticles(updatedParticles);
        setAnimationFrame(requestAnimationFrame(animate));
      } else {
        setIsActive(false);
      }
    };
    
    setAnimationFrame(requestAnimationFrame(animate));
    
    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [isActive, particles, animationFrame]);
  
  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [animationFrame]);
  
  // Only render when active
  if (!isActive) return null;
  
  return (
    <canvas 
      ref={canvasRef} 
      className="confetti-canvas"
      aria-hidden="true"
    />
  );
};

export default Confetti;
