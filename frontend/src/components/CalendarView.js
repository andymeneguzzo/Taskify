import React, { useState, useEffect } from 'react';
import './CalendarView.css';

const CalendarView = ({ tasks }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [tasksByDate, setTasksByDate] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTasks, setSelectedTasks] = useState({ due: [], reminders: [] });

  useEffect(() => {
    // Organize tasks by date
    const taskMap = {};
    
    tasks.forEach(task => {
      if (task.dueDate) {
        const dateString = new Date(task.dueDate).toDateString();
        if (!taskMap[dateString]) {
          taskMap[dateString] = { due: [], reminders: [] };
        }
        taskMap[dateString].due.push(task);
      }
      
      if (task.reminderDate) {
        const dateString = new Date(task.reminderDate).toDateString();
        if (!taskMap[dateString]) {
          taskMap[dateString] = { due: [], reminders: [] };
        }
        taskMap[dateString].reminders.push(task);
      }
    });
    
    setTasksByDate(taskMap);
  }, [tasks]);

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const handleDayClick = (date) => {
    const dateString = date.toDateString();
    const tasksForDay = tasksByDate[dateString] || { due: [], reminders: [] };
    
    setSelectedDate(date);
    setSelectedTasks(tasksForDay);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const formatDate = (date) => {
    return date.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  };

  const renderCalendarDays = () => {
    const monthStart = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
    const monthEnd = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
    const startDate = new Date(monthStart);
    const endDate = new Date(monthEnd);
    
    // Start from Sunday of the week that includes the 1st of the month
    startDate.setDate(startDate.getDate() - startDate.getDay());
    
    // End on Saturday of the week that includes the last day of the month
    endDate.setDate(endDate.getDate() + (6 - endDate.getDay()));
    
    const days = [];
    const today = new Date();
    
    // Add the days of the week header
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    days.push(
      <div className="mini-calendar-week" key="header">
        {daysOfWeek.map(day => (
          <div className="mini-calendar-day-header" key={day}>
            {day}
          </div>
        ))}
      </div>
    );
    
    // Add the days
    let week = [];
    let day = new Date(startDate);
    
    while (day <= endDate) {
      const currentDay = new Date(day);
      const dayNum = day.getDate();
      const isCurrentMonth = day.getMonth() === currentMonth.getMonth();
      const isToday = day.toDateString() === today.toDateString();
      const dateString = day.toDateString();
      const tasksForThisDay = tasksByDate[dateString] || { due: [], reminders: [] };
      
      const hasDueTasks = tasksForThisDay.due.length > 0;
      const hasReminders = tasksForThisDay.reminders.length > 0;
      
      week.push(
        <div
          className={`mini-calendar-day ${!isCurrentMonth ? 'mini-calendar-outside-month' : ''} ${isToday ? 'mini-calendar-today' : ''}`}
          key={day.toString()}
          onClick={() => handleDayClick(currentDay)}
        >
          <span className="mini-day-number">{dayNum}</span>
          <div className="mini-task-indicators">
            {hasDueTasks && <div className="mini-task-indicator mini-due-indicator" title={`${tasksForThisDay.due.length} due tasks`}></div>}
            {hasReminders && <div className="mini-task-indicator mini-reminder-indicator" title={`${tasksForThisDay.reminders.length} reminders`}></div>}
          </div>
        </div>
      );
      
      day.setDate(day.getDate() + 1);
      
      if (day.getDay() === 0 || day > endDate) {
        days.push(
          <div className="mini-calendar-week" key={day.toString()}>
            {week}
          </div>
        );
        week = [];
      }
    }
    
    return days;
  };

  const formatMonth = (date) => {
    return date.toLocaleString('default', { month: 'long', year: 'numeric' });
  };

  return (
    <div className="mini-calendar-view">
      <div className="mini-calendar-header">
        <button className="mini-calendar-nav-button" onClick={handlePrevMonth}>
          &lt;
        </button>
        <div className="mini-calendar-month">{formatMonth(currentMonth)}</div>
        <button className="mini-calendar-nav-button" onClick={handleNextMonth}>
          &gt;
        </button>
      </div>
      
      <div className="mini-calendar-grid">
        {renderCalendarDays()}
      </div>
      
      <div className="mini-calendar-legend">
        <div className="mini-legend-item">
          <div className="mini-legend-color mini-due-color"></div>
          <span>Due Tasks</span>
        </div>
        <div className="mini-legend-item">
          <div className="mini-legend-color mini-reminder-color"></div>
          <span>Reminders</span>
        </div>
      </div>

      {/* Task Modal */}
      {showModal && selectedDate && (
        <div className="mini-calendar-modal-overlay" onClick={closeModal}>
          <div className="mini-calendar-modal" onClick={(e) => e.stopPropagation()}>
            <div className="mini-calendar-modal-header">
              <h3>{formatDate(selectedDate)}</h3>
              <button className="mini-calendar-modal-close" onClick={closeModal}>×</button>
            </div>
            
            <div className="mini-calendar-modal-content">
              {selectedTasks.due.length === 0 && selectedTasks.reminders.length === 0 ? (
                <p className="mini-calendar-no-tasks">No tasks or reminders for this day</p>
              ) : (
                <>
                  {selectedTasks.due.length > 0 && (
                    <div className="mini-calendar-task-section">
                      <h4 className="mini-calendar-task-section-title">
                        <span className="mini-calendar-task-dot mini-due-color"></span> 
                        Due Tasks
                      </h4>
                      <ul className="mini-calendar-task-list">
                        {selectedTasks.due.map((task) => (
                          <li key={task._id} className="mini-calendar-task-item">
                            <div className="mini-calendar-task-title">{task.title}</div>
                            {task.description && <div className="mini-calendar-task-description">{task.description}</div>}
                            <div className="mini-calendar-task-time">
                              Due at: {new Date(task.dueDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {selectedTasks.reminders.length > 0 && (
                    <div className="mini-calendar-task-section">
                      <h4 className="mini-calendar-task-section-title">
                        <span className="mini-calendar-task-dot mini-reminder-color"></span> 
                        Reminders
                      </h4>
                      <ul className="mini-calendar-task-list">
                        {selectedTasks.reminders.map((task) => (
                          <li key={task._id} className="mini-calendar-task-item">
                            <div className="mini-calendar-task-title">{task.title}</div>
                            {task.description && <div className="mini-calendar-task-description">{task.description}</div>}
                            <div className="mini-calendar-task-time">
                              Reminder at: {new Date(task.reminderDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarView;
