import React, {useState} from 'react';
import api from '../api/axios';
import './CreateTaskForm.css';

function CreateTaskForm({onTaskCreated}) {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        status: 'pending',
        category: 'general' // default
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const categories = [
        { id: 'general', name: 'General' },
        { id: 'work', name: 'Work' },
        { id: 'personal', name: 'Personal' },
        { id: 'education', name: 'Education' },
        { id: 'health', name: 'Health' }
    ];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
          ...formData,
          [name]: value
        });
        
        // Clear error when user types
        if (error) setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate form
        if(!formData.title.trim()) {
            setError('Task title is required');
            return;
        }

        setLoading(true);

        try {
            const response = await api.post('/tasks', formData);

            // clear form after successful submission
            setFormData({
                title: '',
                description: '',
                status: 'pending',
                category: 'general'
            });

            // Notify parent component about new task
            if(onTaskCreated) {
                onTaskCreated(response.data);
            }

        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create task. Please try again.');
            console.error('Error creating task:', err);
        } finally {
            setLoading(false);
        }
    };

    /**
     * Renders the task creation form with the following structure:
     * 
     * 1. Form Container
     *    - Title ("Create New Task")
     *    - Error message display (conditionally shown)
     *    - Form element with submit handler
     * 
     * 2. Form Fields:
     *    - Required title input (text)
     *    - Optional description textarea
     *    - Status dropdown (pending/completed/in-progress)
     *    - Category dropdown (populated from categories array)
     * 
     * 3. Form Controls:
     *    - Submit button with loading state
     * 
     * Features:
     * - All fields are controlled components using formData state
     * - Fields are disabled during submission (loading state)
     * - Input validation (title is required)
     * - Error handling display
     */
    return (
        <div className="create-task-form-container">
          <h3>Create New Task</h3>
          
          {error && <div className="create-task-error">{error}</div>}
          
          <form onSubmit={handleSubmit} className="create-task-form">
            <div className="form-group">
              <label htmlFor="title">Task Title*</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="What needs to be done?"
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
                placeholder="Add details about this task..."
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
                  <option value="completed">Completed</option>
                  <option value="in-progress">In Progress</option>
                </select>
              </div>
              
              <div className="form-group">
                <label htmlFor="category">Category</label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
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
            
            <button 
              type="submit" 
              className="create-task-button"
              disabled={loading}
            >
              {loading ? 'Creating...' : 'Create Task'}
            </button>
          </form>
        </div>
    );
}

export default CreateTaskForm;