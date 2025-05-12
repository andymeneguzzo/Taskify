import React from 'react';
import './TaskCard.css';

function TaskCard({task, onDelete, onToggleComplete, onEdit}) {
    const {_id, title, description, status} = task;

    return (
        <div className={`task-card ${status}`}>
          <div className="task-content">
            <h3 className="task-title">{title}</h3>
            {description && <p className="task-description">{description}</p>}
            <span className="task-status">
              Status: {status === 'completed' ? 'Completed' : 'Pending'}
            </span>
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