import React, {useState, useEffect} from 'react';
import api from '../api/axios';
import './EditTaskForm.css';

function EditTaskForm({task, onTaskUpdated, onCancel}) {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        status: 'pending',
        category: 'general',
        dueDate: '',
        reminderDate: ''
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
        if (task) {
            console.log('Original task data:', task);
            
            // Format the dates for the datetime-local input
            const formatDateForInput = (dateString) => {
                if (!dateString) return '';
                
                try {
                    const date = new Date(dateString);
                    if (isNaN(date.getTime())) {
                        console.log('Invalid date:', dateString);
                        return '';
                    }
                    
                    console.log('Formatted date:', date.toISOString().slice(0, 16));
                    return date.toISOString().slice(0, 16);
                } catch (error) {
                    console.error('Error formatting date:', error);
                    return '';
                }
            };
            
            // Set form data with properly formatted dates
            setFormData({
                title: task.title || '',
                description: task.description || '',
                status: task.status || 'pending',
                category: task.category || 'general',
                dueDate: formatDateForInput(task.dueDate),
                reminderDate: formatDateForInput(task.reminderDate)
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
        
        if (!formData.title.trim()) {
            setError('Task title is required');
            return;
        }
        
        setLoading(true);
        
        try {
            // Create a copy of the data to send
            const taskData = { ...formData };
            
            // Fix date formatting
            if (formData.dueDate) {
                taskData.dueDate = new Date(formData.dueDate).toISOString();
            }
            
            if (formData.reminderDate) {
                taskData.reminderDate = new Date(formData.reminderDate).toISOString();
            }
            
            console.log('Data being sent to API for update:', taskData);
            
            const response = await api.patch(`/tasks/${task._id}`, taskData);
            console.log('Update response from API:', response.data);
            
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
            
            {/* Date fields */}
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="dueDate">Due Date</label>
                <input
                  type="datetime-local"
                  id="dueDate"
                  name="dueDate"
                  value={formData.dueDate}
                  onChange={handleChange}
                  disabled={loading}
                  className="date-input"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="reminderDate">Reminder</label>
                <input
                  type="datetime-local"
                  id="reminderDate"
                  name="reminderDate"
                  value={formData.reminderDate}
                  onChange={handleChange}
                  disabled={loading}
                  className="date-input"
                />
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