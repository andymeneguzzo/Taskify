// Core React imports
import React, {useEffect, useState} from 'react'; // React hooks for state and side effects
// Routing import
import {useNavigate} from 'react-router-dom'; // Hook for programmatic navigation
// API client import 
import api from '../api/axios'; // Pre-configured axios instance for API calls

// Component imports
import TaskCard from '../components/TaskCard';
// import TaskForm from '../components/TaskForm'; // not using it anymore
import CreateTaskForm from '../components/CreateTaskForm';
import EditTaskForm from '../components/EditTaskForm';
import TaskFilters from '../components/TaskFilters';
import ThemeToggle from '../components/ThemeToggle';
import NotificationBell from '../components/NotificationBell';

import './Dashboard.css'; // Import CSS file for styling

function Dashboard() {
    const [tasks, setTasks] = useState([]);
    const [filteredTasks, setFilteredTasks] = useState([]);
    const [filters, setFilters] = useState({
        search: '',
        status: 'all',
        category: 'all'
    });

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    // const [newTask, setNewTask] = useState({ title: '', description: '' }); -> not being used now
    const [editingTask, setEditingTask] = useState(null);
    const navigate = useNavigate();

    // Fetch tasks on component mount
    useEffect(() => {
        fetchTasks();
    }, []);

    // Apply filters whenever tasks or filters change
    useEffect(() => {
      applyFilters();
    }, [tasks, filters]);

    // Apply filters to tasks
    const applyFilters = () => {
      let result = [...tasks];
      
      // Apply search filter (case-insensitive)
      if (filters.search.trim()) {
        const searchTerm = filters.search.toLowerCase();
        result = result.filter(task => 
          task.title.toLowerCase().includes(searchTerm) || 
          (task.description && task.description.toLowerCase().includes(searchTerm))
        );
      }
      
      // Apply status filter
      if (filters.status !== 'all') {
        result = result.filter(task => task.status === filters.status);
      }
      
      // Apply category filter
      if (filters.category !== 'all') {
        result = result.filter(task => task.category === filters.category);
      }
      
      setFilteredTasks(result);
    };

    // Handle filter changes
    const handleFilterChange = (newFilters) => {
      setFilters(newFilters);
    };

    const fetchTasks = async () => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await api.get('/tasks');
            setTasks(response.data);
            // Initially, filtered tasks are all tasks
            setFilteredTasks(response.data);
        } catch (err) {
            setError('Failed to fetch tasks. Please try again');
            console.error('Error fetching tasks: ', err);
        } finally {
            setIsLoading(false);
        }
    };

    // Handle logout
    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    // Handle task created
    const handleTaskCreated = (newTask) => {
      setTasks([...tasks, newTask]);
    };

    // Handle editing a task
    const handleEditTask = (task) => {
        setEditingTask({...task});

        // Scroll to the edit form
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
    };

    // Update task
  const handleTaskUpdated = (updatedTask) => {
    setTasks(tasks.map(task => 
      task._id === updatedTask._id ? updatedTask : task
    ));
    setEditingTask(null);
  };

    // Cancel editing
    const handleCancelEdit = () => {
        setEditingTask(null);
    };

    // Mark task as complete or incomplete
    const handleToggleComplete = async (taskId, currentStatus) => {
        try {
            const newStatus = currentStatus === 'completed' ? 'pending' : 'completed';
            const response = await api.put(`/tasks/${taskId}`, { status: newStatus });
            setTasks(tasks.map(task => 
                task._id === taskId ? response.data : task
            ));
        } catch (err) {
            setError('Failed to update task status. Please try again.');
            console.error('Error updating task status:', err);
        }
    };

    // Delete task
    const handleDeleteTask = async (taskId) => {
        if (!window.confirm('Are you sure you want to delete this task?')) return;
        
        try {
            await api.delete(`/tasks/${taskId}`);
            setTasks(tasks.filter(task => task._id !== taskId));
        } catch (err) {
            setError('Failed to delete task. Please try again.');
            console.error('Error deleting task:', err);
        }
    };


    return (
      <div className="dashboard-container">
        <div className="dashboard-header">
          <h2>Taskify</h2>
          <div className="dashboard-controls">
            <NotificationBell />
            <ThemeToggle />
            <button className="logout-btn" onClick={handleLogout}>Logout</button>
          </div>
        </div>
        
        {error && <div className="error-message">{error}</div>}
        
        {/* Task form section - either CreateTaskForm or EditTaskForm */}
        {editingTask ? (
          <EditTaskForm 
            task={editingTask} 
            onTaskUpdated={handleTaskUpdated}
            onCancel={handleCancelEdit}
          />
        ) : (
          <CreateTaskForm onTaskCreated={handleTaskCreated} />
        )}

        {/* Task filters */}
        <TaskFilters onFilterChange={handleFilterChange} />
        
        {/* Tasks list */}
        <div className="tasks-section">
          <div className="tasks-header">
            <h3>Task List</h3>
            <div className="tasks-count">
              Showing {filteredTasks.length} of {tasks.length} tasks
            </div>
          </div>
          
          {isLoading ? (
            <p className="loading-text">Loading tasks...</p>
          ) : filteredTasks.length === 0 ? (
            <div className="empty-state">
              {tasks.length === 0 ? (
                <p className="empty-text">No tasks found. Create your first task above!</p>
              ) : (
                <p className="empty-text">No tasks match your filters. Try changing your search criteria.</p>
              )}
            </div>
          ) : (
            <div className="tasks-grid">
              {filteredTasks.map(task => (
                <div key={task._id} className="task-item-container">
                  <TaskCard
                    task={task}
                    onDelete={handleDeleteTask}
                    onToggleComplete={handleToggleComplete}
                    onEdit={handleEditTask}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
  );
}

export default Dashboard;