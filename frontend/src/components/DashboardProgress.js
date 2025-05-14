import React from 'react';
import './DashboardProgress.css';
import ProgressBar from './ProgressBar';
import CircularProgress from './CircularProgress';

/**
 * DashboardProgress Component
 * 
 * Displays overall progress metrics for all tasks
 * Shows completion rate, pending tasks, and other stats
 * 
 * @param {Object} props
 * @param {Array} props.tasks - Array of all tasks
 */
const DashboardProgress = ({ tasks }) => {
  // Calculate overall task completion metrics
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.status === 'completed').length;
  const inProgressTasks = tasks.filter(task => task.status === 'in-progress').length;
  const pendingTasks = tasks.filter(task => task.status === 'pending').length;
  
  // Calculate completion percentage
  const completionPercentage = totalTasks > 0 
    ? Math.round((completedTasks / totalTasks) * 100) 
    : 0;
  
  // Calculate progress percentage (includes partial credit for in-progress)
  const progressPercentage = totalTasks > 0 
    ? Math.round(((completedTasks + (inProgressTasks * 0.5)) / totalTasks) * 100) 
    : 0;
    
  // Get progress color based on completion percentage
  const getProgressColor = (percentage) => {
    if (percentage >= 80) return '#4caf50'; // Green
    if (percentage >= 50) return '#8bc34a'; // Light green
    if (percentage >= 30) return '#ff9800'; // Orange
    return '#f44336'; // Red
  };

  return (
    <div className="dashboard-progress-container">
      <div className="dashboard-progress-header">
        <h3>Overall Progress</h3>
        <div className="progress-summary">
          <span className="progress-percentage">{progressPercentage}%</span> of all tasks completed
        </div>
      </div>
      
      <div className="dashboard-progress-metrics">
        <div className="dashboard-progress-bar">
          <ProgressBar 
            percentage={progressPercentage}
            size="large"
            barColor={getProgressColor(progressPercentage)}
            animated={true}
          />
        </div>
        
        <div className="dashboard-stats-grid">
          <div className="dashboard-stat-card">
            <div className="stat-info">
              <span className="stat-label">Total Tasks</span>
              <span className="stat-value">{totalTasks}</span>
            </div>
          </div>
          
          <div className="dashboard-stat-card">
            <div className="stat-info">
              <span className="stat-label">Completed</span>
              <span className="stat-value">{completedTasks}</span>
            </div>
            <div className="stat-progress">
              <CircularProgress 
                percentage={completedTasks > 0 ? 100 : 0}
                size="extra-small"
                strokeColor="#4caf50"
                showText={false}
              />
            </div>
          </div>
          
          <div className="dashboard-stat-card">
            <div className="stat-info">
              <span className="stat-label">In Progress</span>
              <span className="stat-value">{inProgressTasks}</span>
            </div>
            <div className="stat-progress">
              <CircularProgress 
                percentage={inProgressTasks > 0 ? 50 : 0}
                size="extra-small" 
                strokeColor="#2196f3"
                showText={false}
              />
            </div>
          </div>
          
          <div className="dashboard-stat-card">
            <div className="stat-info">
              <span className="stat-label">Pending</span>
              <span className="stat-value">{pendingTasks}</span>
            </div>
            <div className="stat-progress">
              <CircularProgress 
                percentage={0}
                size="extra-small"
                strokeColor="#ff9800"
                showText={false}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardProgress;
