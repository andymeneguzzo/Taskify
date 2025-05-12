import React, {useState, useEffect} from 'react';
import api from '../api/axios';
import './EditTaskForm.css';
import TaskCalendar from './TaskCalendar';
import CustomDropdown from './CustomDropdown';

function EditTaskForm({task, onTaskUpdated, onCancel}) {
    const [formData, setFormData] = useState({
        title: task.title || '',
        description: task.description || '',
        status: task.status || 'pending',
        category: task.category || 'general',
        dueDate: task.dueDate || '',
        reminderDate: task.reminderDate || ''
    });

    const [showCalendar, setShowCalendar] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        // Update form when task prop changes
        setFormData({
            title: task.title || '',
            description: task.description || '',
            status: task.status || 'pending',
            category: task.category || 'general',
            dueDate: task.dueDate || '',
            reminderDate: task.reminderDate || ''
        });
    }, [task]);

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

    const handleDueDateChange = (date) => {
        setFormData({
            ...formData,
            dueDate: date
        });
    };

    const handleReminderDateChange = (date) => {
        setFormData({
            ...formData,
            reminderDate: date
        });
    };

    const toggleCalendar = () => {
        setShowCalendar(!showCalendar);
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
            // Create data to send
            const taskData = { ...formData };
            
            // Explicitly convert dates to ISO strings if they exist
            if (formData.dueDate) {
                const dueDate = new Date(formData.dueDate);
                taskData.dueDate = dueDate.toISOString();
            }
            
            if (formData.reminderDate) {
                const reminderDate = new Date(formData.reminderDate);
                taskData.reminderDate = reminderDate.toISOString();
            }
            
            const response = await api.put(`/tasks/${task._id}`, taskData);
            
            // Hide calendar
            setShowCalendar(false);

            // Notify parent component about updated task
            if(onTaskUpdated) {
                onTaskUpdated(response.data);
            }

        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update task. Please try again.');
            console.error('Error updating task:', err);
        } finally {
            setLoading(false);
        }
    };

    // Format date for display in the form
    const formatDateForDisplay = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return `${date.toLocaleDateString()} at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
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
                <CustomDropdown
                  id="status"
                  name="status"
                  label="Status"
                  value={formData.status}
                  onChange={handleChange}
                  disabled={loading}
                  options={[
                    { value: 'pending', label: 'Pending' },
                    { value: 'in-progress', label: 'In Progress' },
                    { value: 'completed', label: 'Completed' }
                  ]}
                />
              </div>
              
              <div className="form-group">
                <CustomDropdown
                  id="category"
                  name="category"
                  label="Category"
                  value={formData.category}
                  onChange={handleChange}
                  disabled={loading}
                  options={categories.map(category => ({
                    value: category.id,
                    label: category.name
                  }))}
                />
              </div>
            </div>
            
            {/* Dates display */}
            <div className="form-row dates-container">
              <div className="form-group">
                <label>Due Date</label>
                <div className="date-display" onClick={toggleCalendar}>
                  {formData.dueDate ? (
                    formatDateForDisplay(formData.dueDate)
                  ) : (
                    <span className="no-date">Set due date</span>
                  )}
                </div>
              </div>
              
              <div className="form-group">
                <label>Reminder</label>
                <div className="date-display" onClick={toggleCalendar}>
                  {formData.reminderDate ? (
                    formatDateForDisplay(formData.reminderDate)
                  ) : (
                    <span className="no-date">Set reminder</span>
                  )}
                </div>
              </div>
            </div>
            
            {/* Calendar Component */}
            {showCalendar && (
              <div className="calendar-container">
                <TaskCalendar
                  dueDate={formData.dueDate}
                  reminderDate={formData.reminderDate}
                  onDueDateChange={handleDueDateChange}
                  onReminderDateChange={handleReminderDateChange}
                />
              </div>
            )}
            
            <div className="form-buttons">
              <button 
                type="button" 
                className="cancel-button"
                onClick={onCancel}
                disabled={loading}
              >
                Cancel
              </button>
              
              <button 
                type="submit" 
                className="save-button"
                disabled={loading}
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
    );
}

export default EditTaskForm;