import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import api from '../api/axios';
import './Dashboard.css'; // Import CSS file for styling

function Dashboard() {
    const [tasks, setTasks] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [newTask, setNewTask] = useState({ title: '', description: '' });
    const [editingTask, setEditingTask] = useState(null);
    const navigate = useNavigate();

    // Fetch tasks on component mount
    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await api.get('/tasks');
            setTasks(response.data);
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

    // Handle adding a new task
    const handleAddTask = async (e) => {
        e.preventDefault();
        if(!newTask.title.trim()) return;

        try {
            const response = await api.post('/tasks', newTask);
            setTasks([...tasks, response.data]);
            setNewTask({title: '', description: ''});
        } catch(err) {
            setError('Failed to add task. Please try again');
            console.error('Error adding task: ', err);
        }
    };

    // Handle editing a task
    const handleEditClick = (task) => {
        setEditingTask({...task});
    };

    // Save edited task
    const handleSaveEdit = async () => {
        if (!editingTask || !editingTask.title.trim()) return;
        
        try {
          // Send PUT request to update the task on the server
          // - Uses the task's _id in the URL to identify which task to update
          // - Sends the updated task data (editingTask) in the request body
          const response = await api.put(`/tasks/${editingTask._id}`, editingTask);
          
          // Update the local tasks state with the server's response
          // - Maps through existing tasks array
          // - Replaces the matching task with the updated version from server
          // - Keeps all other tasks unchanged
          setTasks(tasks.map(task => 
            task._id === editingTask._id ? response.data : task
          ));
          
          // Reset editing state by setting editingTask to null
          // This closes the edit form/modal
          setEditingTask(null);
        } catch (err) {
          // Handle any errors that occur during the update
          // - Shows user-friendly error message
          // - Logs detailed error to console for debugging
          setError('Failed to update task. Please try again.');
          console.error('Error updating task:', err);
        }
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
          {/* Header section with title and logout button */}
          <div className="dashboard-header">
            <h2>Your Tasks</h2>
            <button className="logout-btn" onClick={handleLogout}>Logout</button>
          </div>
          
          {/* Error message display if any errors exist */}
          {error && <div className="error-message">{error}</div>}
          
          {/* Section for adding new tasks */}
          <div className="add-task-section">
            <h3>Add New Task</h3>
            <form onSubmit={handleAddTask}>
              <input
                type="text"
                placeholder="Task title"
                value={newTask.title}
                onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                required
              />
              <textarea
                placeholder="Description (optional)"
                value={newTask.description}
                onChange={(e) => setNewTask({...newTask, description: e.target.value})}
              />
              <button type="submit">Add Task</button>
            </form>
          </div>
          
          {/* Main tasks list display area */}
          <div className="tasks-container">
            <h3>Task List</h3>
            
            {/* Loading state, empty state, or tasks list */}
            {isLoading ? (
              <p>Loading tasks...</p>
            ) : tasks.length === 0 ? (
              <p>No tasks found. Add your first task above!</p>
            ) : (
              <ul className="task-list">
                {tasks.map(task => (
                  <li key={task._id} className={`task-item ${task.status}`}>
                    {/* Conditional rendering for edit mode vs view mode */}
                    {editingTask && editingTask._id === task._id ? (
                      // Edit form when a task is being edited
                      <div className="task-edit-form">
                        <input
                          type="text"
                          value={editingTask.title}
                          onChange={(e) => setEditingTask({...editingTask, title: e.target.value})}
                        />
                        <textarea
                          value={editingTask.description || ''}
                          onChange={(e) => setEditingTask({...editingTask, description: e.target.value})}
                        />
                        <div className="edit-actions">
                          <button onClick={handleSaveEdit}>Save</button>
                          <button onClick={handleCancelEdit}>Cancel</button>
                        </div>
                      </div>
                    ) : (
                      // Normal task display when not in edit mode
                      <>
                        <div className="task-content">
                          <h4>{task.title}</h4>
                          {task.description && <p>{task.description}</p>}
                          <span className="task-status">
                            Status: {task.status === 'completed' ? 'Completed' : 'Pending'}
                          </span>
                        </div>
                        <div className="task-actions">
                          <button 
                            className="toggle-btn"
                            onClick={() => handleToggleComplete(task._id, task.status)}
                          >
                            {task.status === 'completed' ? 'Mark Incomplete' : 'Mark Complete'}
                          </button>
                          <button 
                            className="edit-btn"
                            onClick={() => handleEditClick(task)}
                          >
                            Edit
                          </button>
                          <button 
                            className="delete-btn"
                            onClick={() => handleDeleteTask(task._id)}
                          >
                            Delete
                          </button>
                        </div>
                      </>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
    );
}

export default Dashboard;