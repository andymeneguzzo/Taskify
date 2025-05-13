import React from 'react';
import './CategoryProgress.css';
import ProgressBar from './ProgressBar';

/**
 * CategoryProgress Component
 * 
 * Displays progress visualization for different task categories
 * 
 * @param {Object} props
 * @param {Array} props.tasks - Array of all tasks
 */
const CategoryProgress = ({ tasks }) => {
  // Category definitions
  const categories = [
    { id: 'work', name: 'Work', color: '#2196f3' },
    { id: 'personal', name: 'Personal', color: '#9c27b0' },
    { id: 'education', name: 'Education', color: '#3f51b5' },
    { id: 'health', name: 'Health', color: '#4caf50' },
    { id: 'general', name: 'General', color: '#ff9800' }
  ];
  
  // Calculate metrics for each category
  const categoryMetrics = categories.map(category => {
    const categoryTasks = tasks.filter(task => task.category === category.id);
    const totalInCategory = categoryTasks.length;
    const completedInCategory = categoryTasks.filter(task => task.status === 'completed').length;
    const inProgressInCategory = categoryTasks.filter(task => task.status === 'in-progress').length;
    
    // Calculate progress percentage (completed + half credit for in-progress)
    const progressPercentage = totalInCategory > 0 
      ? Math.round(((completedInCategory + (inProgressInCategory * 0.5)) / totalInCategory) * 100) 
      : 0;
      
    return {
      ...category,
      totalTasks: totalInCategory,
      completedTasks: completedInCategory,
      progressPercentage,
    };
  });
  
  // Sort categories - show categories with tasks first, then by name
  const sortedCategories = [...categoryMetrics].sort((a, b) => {
    if (a.totalTasks === 0 && b.totalTasks > 0) return 1;
    if (a.totalTasks > 0 && b.totalTasks === 0) return -1;
    return a.name.localeCompare(b.name);
  });

  return (
    <div className="category-progress-container">
      <div className="category-progress-header">
        <h3>Category Progress</h3>
      </div>
      
      <div className="category-list">
        {sortedCategories.map(category => (
          <div 
            key={category.id} 
            className={`category-item ${category.totalTasks === 0 ? 'empty' : ''}`}
          >
            <div className="category-header">
              <div className="category-name-container">
                <div 
                  className="category-color-indicator" 
                  style={{ backgroundColor: category.color }}
                ></div>
                <h4 className="category-name">{category.name}</h4>
              </div>
              <div className="category-metrics">
                <span className="category-tasks-count">
                  {category.completedTasks}/{category.totalTasks} tasks
                </span>
              </div>
            </div>
            
            <div className="category-progress-bar">
              <ProgressBar 
                percentage={category.progressPercentage}
                barColor={category.color}
                size="medium"
                showPercentage={true}
                animated={true}
              />
            </div>
          </div>
        ))}
        
        {sortedCategories.every(category => category.totalTasks === 0) && (
          <div className="empty-categories-message">
            No tasks have been assigned to categories yet.
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryProgress;
