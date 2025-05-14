import React from 'react';
import './TaskCard.css';
import CircularProgress from './CircularProgress';

function TaskCard({task, onDelete, onToggleComplete, onEdit}) {
    // Extract all properties except priority directly from task
    const {_id, title, description, status, category, dueDate, reminderDate, subtasks = []} = task;
    
    // Handle priority separately to debug
    console.log('Task data in card:', task);
    console.log('Raw priority value:', task.priority);
    
    // Ensure priority is correctly extracted, with fallback to 'medium'
    const priority = typeof task.priority === 'string' ? task.priority : 'medium';
    console.log('Priority to be used:', priority);

    // Calculate task progress percentage
    // If there are no subtasks, use status as progress indicator
    const calculateProgress = () => {
      // If task is completed, return 100%
      if (status === 'completed') return 100;
      
      // If task is in progress and no subtasks, return 50%
      if (status === 'in-progress' && (!subtasks || subtasks.length === 0)) return 50;
      
      // If task has subtasks, calculate based on completed subtasks
      if (subtasks && subtasks.length > 0) {
        const completedSubtasks = subtasks.filter(subtask => subtask.completed).length;
        return Math.round((completedSubtasks / subtasks.length) * 100);
      }
      
      // Default to 0% for pending tasks with no subtasks
      return 0;
    };

    // category label mapping
    const categoryLabels = {
      general: 'General',
      work: 'Work',
      personal: 'Personal',
      education: 'Education',
      health: 'Health'
    }
    
    // priority label mapping with proper capitalization for ASAP
    const priorityLabels = {
      low: 'Low',
      medium: 'Medium',
      high: 'High',
      asap: 'ASAP'
    }

    // Format date for display
    const formatDate = (dateString) => {
      if (!dateString || dateString === '') return null;
      
      try {
        const date = new Date(dateString);
        // Check if date is valid
        if (isNaN(date.getTime())) return null;
        
        const now = new Date();
        const isToday = date.toDateString() === now.toDateString();
        
        // Format options
        const options = { 
          month: 'short', 
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        };
        
        // Only show year if it's not current year
        if (date.getFullYear() !== now.getFullYear()) {
          options.year = 'numeric';
        }
        
        return isToday 
          ? `Today, ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` 
          : date.toLocaleDateString(undefined, options);
      } catch (error) {
        console.error('Error formatting date:', error);
        return null;
      }
    };

    // Check if due date is upcoming (within next 24 hours)
    const isDueSoon = () => {
      if (!dueDate) return false;
      
      const now = new Date();
      const due = new Date(dueDate);
      const diffTime = due - now;
      const diffHours = diffTime / (1000 * 60 * 60);
      
      return diffHours > 0 && diffHours <= 24;
    };

    // Check if due date is overdue
    const isOverdue = () => {
      if (!dueDate || status === 'completed') return false;
      
      const now = new Date();
      const due = new Date(dueDate);
      
      return due < now;
    };

    // Update the date check to be more explicit
    const hasDueDate = dueDate && dueDate !== null && dueDate !== undefined && dueDate !== '';
    const hasReminderDate = reminderDate && reminderDate !== null && reminderDate !== undefined && reminderDate !== '';

    // Get progress percentage
    const progressPercentage = calculateProgress();

    return (
      <div className={`task-card ${status} ${isOverdue() ? 'overdue' : ''}`}>
        <div className="task-header">
          <h3 className="task-title">{title}</h3>
          <div className="task-progress">
            <CircularProgress 
              percentage={progressPercentage}
              size="extra-small"
              showText={false}
              strokeColor={
                status === 'completed' ? '#4caf50' :
                status === 'in-progress' ? '#2196f3' : 
                '#ff9800'
              }
            />
          </div>
        </div>
        
        <div className="task-content">
          {description && <p className="task-description">{description}</p>}
          
          <div className="task-details">
            <span className={`task-status status-${status}`}>
              {status === 'completed' ? 'Completed' : 
               status === 'in-progress' ? 'In Progress' : 'Pending'}
            </span>
            
            {category && (
              <span className={`task-category category-${category}`}>
                {categoryLabels[category] || category}
              </span>
            )}
            
            {/* Always display priority badge with proper handling */}
            <span className={`task-priority priority-${priority}`}>
              {priorityLabels[priority] || priorityLabels.medium}
            </span>
          </div>
          
          {/* Date information */}
          <div className="task-dates">
            {task.dueDate ? (
              <div className={`task-due-date ${isDueSoon() ? 'due-soon' : ''} ${isOverdue() ? 'overdue' : ''}`}>
                <span className="date-label">Due:</span>
                <span className="date-value">{formatDate(dueDate) || 'Invalid date format'}</span>
              </div>
            ) : null}
            
            {task.reminderDate ? (
              <div className="task-reminder-date">
                <span className="date-label">Reminder:</span>
                <span className="date-value">{formatDate(reminderDate) || 'Invalid date format'}</span>
              </div>
            ) : null}
            
            {!task.dueDate && !task.reminderDate && (
              <div className="no-dates">No dates set</div>
            )}
          </div>
        </div>
        
        <div className="task-actions">
          <button 
            className="toggle-btn"
            onClick={() => onToggleComplete(_id, status)}
          >
            {status === 'completed' ? 'Mark Incomplete' : 'Mark Complete'}
          </button>
          <button 
            className="edit-btn"
            onClick={() => onEdit(task)}
          >
            Edit
          </button>
          <button 
            className="delete-btn"
            onClick={() => onDelete(_id)}
          >
            Delete
          </button>
        </div>
      </div>
    );
}

export default TaskCard;