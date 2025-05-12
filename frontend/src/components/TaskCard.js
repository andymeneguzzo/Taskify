import React from 'react';
import './TaskCard.css';

function TaskCard({task, onDelete, onToggleComplete, onEdit}) {
    const {_id, title, description, status, category, dueDate, reminderDate} = task;

    console.log('Task data in card:', task);

    // category label mapping
    const categoryLabels = {
      general: 'General',
      work: 'Work',
      personal: 'Personal',
      education: 'Education',
      health: 'Health'
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
      if (!dueDate) return false;
      
      const now = new Date();
      const due = new Date(dueDate);
      
      return due < now && status !== 'completed';
    };

    // Update the date check to be more explicit
    const hasDueDate = dueDate && dueDate !== null && dueDate !== undefined && dueDate !== '';
    const hasReminderDate = reminderDate && reminderDate !== null && reminderDate !== undefined && reminderDate !== '';

    return (
      <div className={`task-card ${status}`}>
        <div className="task-content">
          <h3 className="task-title">{title}</h3>
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
          </div>
          
          {/* Date information */}
          {(dueDate || reminderDate) && (
            <div className="task-dates">
              {dueDate && (
                <div className={`task-due-date ${isDueSoon() ? 'due-soon' : ''} ${isOverdue() ? 'overdue' : ''}`}>
                  <span className="date-label">Due:</span>
                  <span className="date-value">{formatDate(dueDate)}</span>
                </div>
              )}
              
              {reminderDate && (
                <div className="task-reminder-date">
                  <span className="date-label">Reminder:</span>
                  <span className="date-value">{formatDate(reminderDate)}</span>
                </div>
              )}
            </div>
          )}
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