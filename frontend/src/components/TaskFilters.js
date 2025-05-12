import React, {useState} from 'react';
import './TaskFilters.css';
import CustomDropdown from './CustomDropdown';

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

    // Status filter options
    const statusOptions = [
        { value: 'all', label: 'All Statuses' },
        { value: 'pending', label: 'Pending' },
        { value: 'in-progress', label: 'In Progress' },
        { value: 'completed', label: 'Completed' }
    ];

    // Category filter options
    const categoryOptions = [
        { value: 'all', label: 'All Categories' },
        { value: 'general', label: 'General' },
        { value: 'work', label: 'Work' },
        { value: 'personal', label: 'Personal' },
        { value: 'education', label: 'Education' },
        { value: 'health', label: 'Health' }
    ];

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
              <CustomDropdown
                id="status-filter"
                name="status"
                label="Status"
                value={filters.status}
                onChange={handleInputChange}
                options={statusOptions}
              />
            </div>
            
            <div className="filter-group">
              <CustomDropdown
                id="category-filter"
                name="category"
                label="Category"
                value={filters.category}
                onChange={handleInputChange}
                options={categoryOptions}
              />
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