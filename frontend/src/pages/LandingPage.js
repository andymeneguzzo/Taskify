import React from 'react';
import { Link } from 'react-router-dom';
import './LandingPage.css';

// Feature card component with hover effects
const FeatureCard = ({ icon, title, description }) => {
  return (
    <div className="feature-card neu-card">
      <div className="feature-icon">{icon}</div>
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
};

function LandingPage() {
  return (
    <div className="landing-container">
      <div className="landing-hero">
        <div className="hero-content">
          <h1>Taskify</h1>
          <p className="hero-subtitle">Your Easy Productivity Solution</p>
          <div className="hero-buttons">
            <Link to="/login" className="neu-button neu-button-primary login-btn">
              Log in
            </Link>
            <Link to="/register" className="neu-button register-btn">
              Sign up
            </Link>
          </div>
        </div>
      </div>

      <div className="features-section">
        <h2>Features</h2>
        <div className="features-grid">
          <FeatureCard 
            icon={<i className="fas fa-tasks"></i>}
            title="Task Management"
            description="Create, organize, and track your tasks easily. Set priorities and deadlines to stay on top of your work."
          />
          <FeatureCard
            icon={<i className="fas fa-calendar-alt"></i>}
            title="Calendar Integration"
            description="View all your tasks and appointments in a clean calendar interface. Schedule your work efficiently."
          />
          <FeatureCard
            icon={<i className="fas fa-bell"></i>}
            title="Smart Notifications"
            description="Never miss a deadline anymore! Get reminders when tasks are due and get notified when you have overdue tasks."
          />
          <FeatureCard
            icon={<i className="fas fa-book"></i>}
            title="Studify Mode"
            description="Enhance your learning with Studify. Create a study path with Topics and Subtopics, with file attachments and notes."
          />
          <FeatureCard
            icon={<i className="fas fa-chart-line"></i>}
            title="Progress Tracking"
            description="Visualize your productivity with detailed analytics and progress charts."
          />
          <FeatureCard
            icon={<i className="fas fa-moon"></i>}
            title="Dark Mode"
            description="Reduce eye strain with our beautiful dark mode option. Work comfortably day or night."
          />
        </div>
      </div>

      <div className="cta-section">
        <div className="cta-content neu-container">
          <h2>Ready to boost your productivity?</h2>
          <p>Join now to start changing your life and study habits with Taskify.</p>
          <Link to="/register" className="neu-button neu-button-primary">
            Get Started Now
          </Link>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
