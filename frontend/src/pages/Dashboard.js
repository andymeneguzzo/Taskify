import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import api from '../api/axios';

import TaskCard from '../components/TaskCard';
import TaskForm from '../components/TaskForm';
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
    const handleCreateTask = async (e) => {
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
    const handleEditTask = (task) => {
        setEditingTask({...task});
    };

    // Save edited task
    const handleUpdateTask = async () => {
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
        <div className="dashboard-header">
          <h2>Your Tasks</h2>
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </div>
        
        {error && <div className="error-message">{error}</div>}
        
        {/* Task form section */}
        <div className="task-form-section">
          <h3>{editingTask ? 'Edit Task' : 'Create New Task'}</h3>
          <TaskForm 
            task={editingTask} 
            onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
            onCancel={handleCancelEdit}
          />
        </div>
        
        {/* Tasks list */}
        <div className="tasks-section">
          <h3>Task List</h3>
          
          {isLoading ? (
            <p className="loading-text">Loading tasks...</p>
          ) : tasks.length === 0 ? (
            <p className="empty-text">No tasks found. Create your first task above!</p>
          ) : (
            <div className="tasks-grid">
              {tasks.map(task => (
                <TaskCard
                  key={task._id}
                  task={task}
                  onDelete={handleDeleteTask}
                  onToggleComplete={handleToggleComplete}
                  onEdit={handleEditTask}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    );
}

export default Dashboard;