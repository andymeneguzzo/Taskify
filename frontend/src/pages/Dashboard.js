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

            {isLoading ? (
                <p>Loading tasks...</p>
            ) : (
                <div className="tasks-container">
                    {tasks.length === 0 ? (
                        <p>No tasks found. Create your first task!</p>
                    ) : (
                        <ul className="task-list">
                            {tasks.map(task => (
                                <li key={task.id} className="task-item">
                                    <h3>{task.title}</h3>
                                    <span className={`status ${task.status.toLowerCase().replace(' ', '-')}`}>{task.status}</span>
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