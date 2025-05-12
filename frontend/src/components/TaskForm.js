import React, {useState, useEffect} from 'react';
import './TaskForm.css';

function TaskForm({task, onSubmit, onCancel}) {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        status: 'pending'
    });

    const [errors, setErrors] = useState({});

    useEffect(() => {
        if(task) {
            setFormData({
                title: task.title || '',
                description: task.description || '',
                status: task.status || 'pending'
            });
        }
    }, [task]);

    /**
     * Handles form input changes by:
     * 1. Updating the corresponding field in form state
     * 2. Clearing any previous validation error for that field
     * 
     * This creates a controlled form where React manages the input values.
     * When a user types in a field:
     * - The new value updates the form state
     * - If that field had an error, it gets cleared (since user is fixing it)
     * 
     * @param {Object} e - The change event containing:
     *   - target.name: identifies which form field changed (matches state keys)
     *   - target.value: contains the new input value
     */
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
          ...formData,
          [name]: value
        });
        
        // Clear error when field is edited
        if (errors[name]) {
          setErrors({
            ...errors,
            [name]: ''
          });
        }
      };

    /**
     * Validates the form data and sets any validation errors.
     * Currently only checks if title field is empty.
     * @returns {boolean} True if form is valid (no errors), false otherwise
     */
    const validate = () => {
        const newErrors = {};

        // Validate title - must not be empty
        if(!formData.title.trim()) {
            newErrors.title = 'Title is required';
        }

        // Update errors state with any validation errors found
        setErrors(newErrors);
        
        // Return true if no errors (empty object), false otherwise
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        // Prevent default form submission behavior which causes page reload
        e.preventDefault();
        
        // Validate form inputs before submission
        if (validate()) {
          // If validation passes, call the parent component's onSubmit handler
          // with the current form data
          onSubmit(formData);
          
          // Reset form fields to initial state only if this is a new task form
          // (not an edit form). We check if 'task' prop exists to determine this.
          if (!task) {
            setFormData({
              title: '',          // Clear title field
              description: '',    // Clear description field
              status: 'pending'   // Reset status to default 'pending'
            });
          }
        }
    };

    return (
        // Form container with submit handler
        <form className="task-form" onSubmit={handleSubmit}>
          {/* Title input field with validation */}
          <div className="form-group">
            <label htmlFor="title">Task Title*</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter task title"
              className={errors.title ? 'error' : ''}
            />
            {/* Display error message if title validation fails */}
            {errors.title && <span className="error-message">{errors.title}</span>}
          </div>
          
          {/* Optional description textarea */}
          <div className="form-group">
            <label htmlFor="description">Description (optional)</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter task description"
              rows="3"
            />
          </div>
          
          {/* Status dropdown - only shown when editing existing task */}
          {task && (
            <div className="form-group">
              <label htmlFor="status">Status</label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          )}
          
          {/* Form action buttons */}
          <div className="form-actions">
            {/* Submit button - changes text based on create/edit mode */}
            <button type="submit" className="submit-btn">
              {task ? 'Update Task' : 'Create Task'}
            </button>
            {/* Cancel button - only shown when editing existing task */}
            {task && (
              <button 
                type="button" 
                className="cancel-btn" 
                onClick={onCancel}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
    );
}

export default TaskForm;