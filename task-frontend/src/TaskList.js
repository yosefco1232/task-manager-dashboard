import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function TaskList({ onLogout }) {
  const [tasks, setTasks] = useState([]);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newDate, setNewDate] = useState('');
  const [expandedMonths, setExpandedMonths] = useState({});
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  useEffect(() => {
    fetch('https://https-github-com-yosefco1232-task.onrender.com/tasks', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        setTasks(Array.isArray(data) ? data : []);
      });
  }, [token]);

  const handleAddTask = (e) => {
    e.preventDefault();
    fetch('https://https-github-com-yosefco1232-task.onrender.com/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        text: newTitle,
        content: newContent,
        dueDate: newDate
      })
    })
      .then(res => res.json())
      .then(added => {
        setTasks([...tasks, added]);
        setNewTitle('');
        setNewContent('');
        setNewDate('');
      });
  };

  const handleDelete = (id) => {
    fetch(`https://https-github-com-yosefco1232-task.onrender.com/tasks/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    }).then(() => {
      setTasks(tasks.filter(task => task._id !== id));
    });
  };

  const updateStatus = (id, status) => {
    fetch(`https://https-github-com-yosefco1232-task.onrender.com/tasks/${id}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ status })
    }).then(() => {
      setTasks(tasks.map(t => t._id === id ? { ...t, status } : t));
    });
  };

  const groupedTasks = tasks.reduce((acc, task) => {
    if (!task.dueDate) return acc;
    const date = new Date(task.dueDate);
    const key = `${date.toLocaleString('default', { month: 'long' })} ${date.getFullYear()}`;
    acc[key] = acc[key] || [];
    acc[key].push(task);
    return acc;
  }, {});

  const toggleMonth = (monthKey) => {
    setExpandedMonths(prev => ({ ...prev, [monthKey]: !prev[monthKey] }));
  };
  return (
    <div style={{
      height: '100vh',
      width: '100vw',
      backgroundImage: 'url("/images/dashboard-preview.png")',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      position: 'relative',
      overflowY: 'auto',
      fontFamily: 'Arial, sans-serif'
    }}>
      {/* Top Navigation Buttons */}
      <div style={{
        position: 'absolute',
        top: '20px',
        left: '20px',
        zIndex: 10,
        display: 'flex',
        gap: '1rem'
      }}>
        <button onClick={onLogout} style={{
          backgroundColor: '#dc3545',
          color: '#fff',
          padding: '0.5rem 1rem',
          borderRadius: '6px',
          border: 'none'
        }}>🚪 Logout</button>

       

        <button onClick={() => navigate('/performance')} style={{
          backgroundColor: '#6c757d',
          color: '#fff',
          padding: '0.5rem 1rem',
          borderRadius: '6px',
          border: 'none'
        }}>📈 Performance</button>
      </div>

      {/* Task Panel */}
      <div style={{
        maxWidth: '700px',
        margin: '4rem auto',
        backgroundColor: 'rgba(255,255,255,0.9)',
        padding: '2rem',
        borderRadius: '12px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
      }}>
        <h1 style={{ textAlign: 'center', color: '#333' }}>🗓 Tasks by Month</h1>

        {/* Task Creation Form */}
        <form onSubmit={handleAddTask} style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          marginBottom: '2rem'
        }}>
          <input
            type="text"
            placeholder="Title"
            value={newTitle}
            onChange={e => setNewTitle(e.target.value)}
            required
            style={{ padding: '0.75rem', borderRadius: '6px', border: '1px solid #ccc' }}
          />
          <textarea
            placeholder="Details"
            value={newContent}
            onChange={e => setNewContent(e.target.value)}
            rows="3"
            style={{ padding: '0.75rem', borderRadius: '6px', border: '1px solid #ccc' }}
          />
          <input
            type="date"
            value={newDate}
            onChange={e => setNewDate(e.target.value)}
            style={{ padding: '0.75rem', borderRadius: '6px', border: '1px solid #ccc' }}
          />
          <button type="submit" style={{
            padding: '0.75rem',
            borderRadius: '6px',
            backgroundColor: '#007bff',
            color: '#fff',
            border: 'none'
          }}>Add Task</button>
        </form>

        {/* Tasks Grouped by Month */}
        {Object.keys(groupedTasks)
          .sort((a, b) => new Date(groupedTasks[b][0].dueDate) - new Date(groupedTasks[a][0].dueDate))
          .map(month => (
          <div key={month} style={{ marginBottom: '2rem' }}>
            <button onClick={() => toggleMonth(month)} style={{
              width: '100%',
              backgroundColor: '#f8f9fa',
              border: '1px solid #ccc',
              padding: '0.5rem',
              borderRadius: '6px',
              textAlign: 'left',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}>
              📅 {month} ({groupedTasks[month].length} tasks)
            </button>

            {expandedMonths[month] && (
              <ul style={{ listStyle: 'none', padding: 0, marginTop: '0.5rem' }}>
                {groupedTasks[month].map(task => (
                  <li key={task._id} style={{
                    background: '#fff',
                    borderLeft: '4px solid #007bff',
                    borderRadius: '8px',
                    marginBottom: '1rem',
                    padding: '1rem'
                  }}>
                    <h3>{task.text}</h3>
                    {task.content && <p>{task.content}</p>}
                    <p>Due: {new Date(task.dueDate).toLocaleDateString()}</p>
                    {task.status && <p>Status: {task.status}</p>}
                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                      <button onClick={() => updateStatus(task._id, 'onTime')} style={{
                        backgroundColor: '#28a745', color: '#fff', padding: '0.4rem 0.6rem', borderRadius: '4px'
                      }}>✔️ On Time</button>
                      <button onClick={() => updateStatus(task._id, 'late')} style={{
                        backgroundColor: '#fd7e14', color: '#fff', padding: '0.4rem 0.6rem', borderRadius: '4px'
                      }}>⏰ Late</button>
                      <button onClick={() => updateStatus(task._id, 'notCompleted')} style={{
                        backgroundColor: '#dc3545', color: '#fff', padding: '0.4rem 0.6rem', borderRadius: '4px'
                      }}>❌ Missed</button>
                    </div>
                    <button onClick={() => handleDelete(task._id)} style={{
                      marginTop: '0.5rem',
                      padding: '0.4rem 0.8rem',
                      backgroundColor: '#6c757d',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '5px',
                      cursor: 'pointer'
                    }}>Delete</button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default TaskList;
