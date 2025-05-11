import React, {useEffect, useState} from 'react';
import {Link} from 'react-router-dom';

function Dashboard() {
    const [tasks, setTasks] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // TODO: Fetch tasks from backend
        // Mock data for now

        setTimeout(() => {
            setTasks([
                {id: 1, title: 'Complete project setup', status: 'In Progress'},
                {id: 2, title: 'Implement authentication', status: 'Completed'},
                {id: 3, title: 'Create task management UI', status: 'Pending'}
            ]);
            setIsLoading(false);
        }, 1000);
    }, []);

    return (
        <div className="dashboard-container">
            <h2>Dashboard</h2>
            <div className="dashboard-header">
                <button className="add-task-btn">Add new task</button>
                <button className="logout-btn">Logout</button>
            </div>

            {/* Conditional rendering based on loading state */}
            {isLoading ? (
                // Show loading message while data is being fetched
                <p>Loading tasks...</p>
            ) : (
                // Once loading is complete, show tasks container
                <div className="tasks-container">
                    {/* Check if there are any tasks */}
                    {tasks.length === 0 ? (
                        // Show message if no tasks exist
                        <p>No tasks found. Create your first task!</p>
                    ) : (
                        // Render task list if tasks exist
                        <ul className="task-list">
                            {/* Map through each task and render as list item */}
                            {tasks.map(task => (
                                <li key={task.id} className="task-item">
                                    {/* Display task title */}
                                    <h3>{task.title}</h3>
                                    {/* Display task status with dynamic class for styling */}
                                    <span className={`status ${task.status.toLowerCase().replace(' ', '-')}`}>
                                        {task.status}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            )}
        </div>
    );
}

export default Dashboard;