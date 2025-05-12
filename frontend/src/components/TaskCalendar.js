import React, { useState, useEffect } from 'react';
import './TaskCalendar.css';

const TaskCalendar = ({ dueDate, reminderDate, onDueDateChange, onReminderDateChange }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState({
    due: dueDate ? new Date(dueDate).toTimeString().slice(0, 5) : '12:00',
    reminder: reminderDate ? new Date(reminderDate).toTimeString().slice(0, 5) : '12:00'
  });
  const [activeTab, setActiveTab] = useState('due');

  useEffect(() => {
    // Set initial selected date if dueDate exists
    if (dueDate) {
      setSelectedDate(new Date(dueDate));
    } else if (reminderDate) {
      setSelectedDate(new Date(reminderDate));
    }
  }, [dueDate, reminderDate]);

  const handlePrevMonth = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const handleNextMonth = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const handleDateClick = (day) => {
    const selectedDateTime = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      day
    );
    
    // Set the selected date
    setSelectedDate(selectedDateTime);
    
    // Update the time
    updateDateTime(selectedDateTime, activeTab === 'due' ? selectedTime.due : selectedTime.reminder);
  };

  const handleTimeChange = (e) => {
    const newTime = e.target.value;
    
    if (activeTab === 'due') {
      setSelectedTime({ ...selectedTime, due: newTime });
      if (selectedDate) {
        updateDateTime(selectedDate, newTime, 'due');
      }
    } else {
      setSelectedTime({ ...selectedTime, reminder: newTime });
      if (selectedDate) {
        updateDateTime(selectedDate, newTime, 'reminder');
      }
    }
  };

  const updateDateTime = (date, time, dateType = activeTab) => {
    if (!date) return;
    
    const [hours, minutes] = time.split(':');
    const newDate = new Date(date);
    newDate.setHours(parseInt(hours, 10), parseInt(minutes, 10));
    
    if (dateType === 'due') {
      onDueDateChange(newDate.toISOString());
    } else {
      onReminderDateChange(newDate.toISOString());
    }
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
      <div className="calendar-week" key="header">
        {daysOfWeek.map(day => (
          <div className="calendar-day-header" key={day}>
            {day}
          </div>
        ))}
      </div>
    );
    
    // Add the days
    let week = [];
    let day = new Date(startDate);
    
    while (day <= endDate) {
      const cloneDay = new Date(day);
      const dayNum = day.getDate();
      const isCurrentMonth = day.getMonth() === currentMonth.getMonth();
      const isToday = day.toDateString() === today.toDateString();
      const isDueDate = dueDate && day.toDateString() === new Date(dueDate).toDateString();
      const isReminderDate = reminderDate && day.toDateString() === new Date(reminderDate).toDateString();
      const isSelected = selectedDate && day.toDateString() === selectedDate.toDateString();
      
      week.push(
        <div
          className={`calendar-day ${!isCurrentMonth ? 'outside-month' : ''} ${isToday ? 'today' : ''} 
            ${isSelected ? 'selected' : ''} ${isDueDate ? 'due-date' : ''} ${isReminderDate ? 'reminder-date' : ''}`}
          key={day.toString()}
          onClick={() => handleDateClick(dayNum)}
        >
          <span>{dayNum}</span>
          {isDueDate && <div className="date-indicator due-indicator"></div>}
          {isReminderDate && <div className="date-indicator reminder-indicator"></div>}
        </div>
      );
      
      day.setDate(day.getDate() + 1);
      
      if (day.getDay() === 0 || day > endDate) {
        days.push(
          <div className="calendar-week" key={day.toString()}>
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

  // Modify the tab switching function to prevent form submission
  const handleTabChange = (e, tab) => {
    // Prevent event propagation to avoid triggering form submission
    e.preventDefault();
    e.stopPropagation();
    setActiveTab(tab);
  };

  return (
    <div className="task-calendar">
      <div className="calendar-tabs">
        <button 
          className={`calendar-tab ${activeTab === 'due' ? 'active' : ''}`} 
          onClick={(e) => handleTabChange(e, 'due')}
        >
          Due Date
        </button>
        <button 
          className={`calendar-tab ${activeTab === 'reminder' ? 'active' : ''}`} 
          onClick={(e) => handleTabChange(e, 'reminder')}
        >
          Reminder Date
        </button>
      </div>
      
      <div className="calendar-header">
        <button className="calendar-nav-button" onClick={handlePrevMonth}>
          &lt;
        </button>
        <div className="calendar-month">{formatMonth(currentMonth)}</div>
        <button className="calendar-nav-button" onClick={handleNextMonth}>
          &gt;
        </button>
      </div>
      
      <div className="calendar-grid">
        {renderCalendarDays()}
      </div>
      
      <div className="calendar-time">
        <label>Time:</label>
        <input 
          type="time" 
          className="time-input neu-input"
          value={activeTab === 'due' ? selectedTime.due : selectedTime.reminder}
          onChange={handleTimeChange}
        />
      </div>
      
      <div className="calendar-legend">
        <div className="legend-item">
          <div className="legend-color due-color"></div>
          <span>Due Date</span>
        </div>
        <div className="legend-item">
          <div className="legend-color reminder-color"></div>
          <span>Reminder</span>
        </div>
      </div>
    </div>
  );
};

export default TaskCalendar;
