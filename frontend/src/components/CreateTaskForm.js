import React, {useState} from 'react';
import api from '../api/axios';
import './CreateTaskForm.css';
import TaskCalendar from './TaskCalendar';
import CustomDropdown from './CustomDropdown';

function CreateTaskForm({onTaskCreated}) {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        status: 'pending',
        category: 'general', // default
        dueDate: '',
        reminderDate: ''
    });

    const [showCalendar, setShowCalendar] = useState(false);
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

    const toggleCalendar = (e) => {
        // Prevent the event from reaching any parent form elements
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
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
            // Log the form data
            console.log('Raw form data:', {
                dueDate: formData.dueDate,
                reminderDate: formData.reminderDate
            });

            // Create data to send
            const taskData = { ...formData };
            
            // Explicitly convert dates to ISO strings if they exist
            if (formData.dueDate) {
                console.log('Converting dueDate:', formData.dueDate);
                const dueDate = new Date(formData.dueDate);
                taskData.dueDate = dueDate.toISOString();
                console.log('Converted dueDate:', taskData.dueDate);
            }
            
            if (formData.reminderDate) {
                console.log('Converting reminderDate:', formData.reminderDate);
                const reminderDate = new Date(formData.reminderDate);
                taskData.reminderDate = reminderDate.toISOString();
                console.log('Converted reminderDate:', taskData.reminderDate);
            }
            
            console.log('Data being sent to API:', taskData);

            const response = await api.post('/tasks', taskData);
            console.log('Response from API:', response.data);
            console.log('Response includes dates:', {
                dueDate: response.data.dueDate,
                reminderDate: response.data.reminderDate
            });

            // clear form after successful submission
            setFormData({
                title: '',
                description: '',
                status: 'pending',
                category: 'general',
                dueDate: '',
                reminderDate: ''
            });
            
            // Hide calendar
            setShowCalendar(false);

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

    // Format date for display in the form
    const formatDateForDisplay = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return `${date.toLocaleDateString()} at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
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
                <div className="date-display" onClick={(e) => toggleCalendar(e)}>
                  {formData.dueDate ? (
                    formatDateForDisplay(formData.dueDate)
                  ) : (
                    <span className="no-date">Set due date</span>
                  )}
                </div>
              </div>
              
              <div className="form-group">
                <label>Reminder</label>
                <div className="date-display" onClick={(e) => toggleCalendar(e)}>
                  {formData.reminderDate ? (
                    formatDateForDisplay(formData.reminderDate)
                  ) : (
                    <span className="no-date">Set reminder</span>
                  )}
                </div>
              </div>
            </div>
            
            {/* Calendar Component - without form prevention */}
            {showCalendar && (
              <>
                <div className="calendar-container" onClick={(e) => e.stopPropagation()}>
                  <TaskCalendar
                    dueDate={formData.dueDate}
                    reminderDate={formData.reminderDate}
                    onDueDateChange={handleDueDateChange}
                    onReminderDateChange={handleReminderDateChange}
                  />
                </div>
                <div className="done-button-container">
                  <button 
                    type="button" 
                    className="done-button" 
                    onClick={(e) => toggleCalendar(e)}
                  >
                    Done
                  </button>
                </div>
              </>
            )}
            
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