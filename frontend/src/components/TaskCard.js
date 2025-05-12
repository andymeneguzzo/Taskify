import React from 'react';
import './TaskCard.css';

function TaskCard({task, onDelete, onToggleComplete, onEdit}) {
    const {_id, title, description, status, category} = task;

    // category label mapping
    const categoryLabels = {
      general: 'General',
      work: 'Work',
      personal: 'Personal',
      education: 'Education',
      health: 'Health'
    }

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