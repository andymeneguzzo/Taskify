import React, {useState, useEffect} from 'react';
import api from '../api/axios';
import './EditTaskForm.css';

function EditTaskForm({task, onTaskUpdated, onCancel}) {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        status: 'pending',
        category: 'general'
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const categories = [
        { id: 'general', name: 'General' },
        { id: 'work', name: 'Work' },
        { id: 'personal', name: 'Personal' },
        { id: 'education', name: 'Education' },
        { id: 'health', name: 'Health' }
    ];

    useEffect(() => {
        if(task) {
            setFormData({
                title: task.title || '',
                description: task.description || '',
                status: task.status || 'pending',
                category: task.category || 'general'
            });
        }
    }, [task]);

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData({
            ...formData,
            [name]: value
        });

        // clear error when user types
        if(error) setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validate form
        if (!formData.title.trim()) {
          setError('Task title is required');
          return;
        }
        
        setLoading(true);
        
        try {
          // Use PATCH method to update only the changed fields
          const response = await api.patch(`/tasks/${task._id}`, formData);
          
          // Notify parent component about the updated task
          if (onTaskUpdated) {
            onTaskUpdated(response.data);
          }
          
        } catch (err) {
          setError(err.response?.data?.message || 'Failed to update task. Please try again.');
          console.error('Error updating task:', err);
        } finally {
          setLoading(false);
        }
    };

    return (
        <div className="edit-task-form-container">
          <h3>Edit Task</h3>
          
          {error && <div className="edit-task-error">{error}</div>}
          
          <form onSubmit={handleSubmit} className="edit-task-form">
            <div className="form-group">
              <label htmlFor="title">Task Title*</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Task title"
                disabled={loading}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Task description"
                rows="3"
                disabled={loading}
              />
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="status">Status</label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  disabled={loading}
                >
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
              
              <div className="form-group">
                <label htmlFor="category">Category</label>
                <select
                  id="category"
                  name="category"
                  value={formData.category || 'general'}
                  onChange={handleChange}
                  disabled={loading}
                >
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="form-actions">
              <button 
                type="submit" 
                className="update-task-button"
                disabled={loading}
              >
                {loading ? 'Updating...' : 'Update Task'}
              </button>
              
              <button 
                type="button" 
                className="cancel-button"
                onClick={onCancel}
                disabled={loading}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
    );
}

export default EditTaskForm;