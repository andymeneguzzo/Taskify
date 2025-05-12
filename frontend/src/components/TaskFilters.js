import React, {useState} from 'react';
import './TaskFilters.css';

function TaskFilters({onFilterChange}) {
    const [filters, setFilters] = useState({
        search: '',
        status: 'all',
        category: 'all'
    });

    /**
     * Handles changes to filter inputs and propagates updates
     * 
     * This function:
     * 1. Extracts the name and value from the changed input element
     * 2. Creates an updated filters object by merging the new value with existing filters
     * 3. Updates local component state with the new filters
     * 4. Notifies parent component of filter changes via callback
     * 
     * @param {Object} e - The change event from the input element
     */
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        
        const updatedFilters = {
          ...filters,
          [name]: value
        };
        
        setFilters(updatedFilters);
        onFilterChange(updatedFilters);
    };

    const clearFilters = () => {
        const resetFilters = {
          search: '',
          status: 'all',
          category: 'all'
        };
        
        setFilters(resetFilters);
        onFilterChange(resetFilters);
    };

    /**
     * Renders the task filtering interface with:
     * - A search input field for text-based filtering
     * - Status dropdown with options: All, Pending, In Progress, Completed
     * - Category dropdown with options: All, General, Work, Personal, Education, Health
     * - Clear Filters button to reset all filters
     * 
     * The component:
     * 1. Maintains controlled inputs that reflect the current filter state
     * 2. Uses handleInputChange to update filters on user input
     * 3. Provides clearFilters functionality via button click
     * 4. Organizes UI elements with appropriate semantic HTML and CSS classes
     * 
     * All filter changes are propagated to the parent component via callbacks
     */
    return (
        <div className="task-filters">
          <div className="filter-search">
            <input
              type="text"
              name="search"
              value={filters.search}
              onChange={handleInputChange}
              placeholder="Search tasks..."
              className="search-input"
            />
          </div>
          
          <div className="filter-controls">
            <div className="filter-group">
              <label htmlFor="status-filter">Status:</label>
              <select
                id="status-filter"
                name="status"
                value={filters.status}
                onChange={handleInputChange}
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            
            <div className="filter-group">
              <label htmlFor="category-filter">Category:</label>
              <select
                id="category-filter"
                name="category"
                value={filters.category}
                onChange={handleInputChange}
              >
                <option value="all">All Categories</option>
                <option value="general">General</option>
                <option value="work">Work</option>
                <option value="personal">Personal</option>
                <option value="education">Education</option>
                <option value="health">Health</option>
              </select>
            </div>
            
            <button 
              className="clear-filters-btn"
              onClick={clearFilters}
            >
              Clear Filters
            </button>
          </div>
        </div>
    );
}

export default TaskFilters;