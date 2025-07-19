import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend
} from 'recharts';

function PerformancePage() {
  const [data, setData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch('http://localhost:3000/stats', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(stats => {
        const formatted = Object.keys(stats).map(month => ({
          name: month,
          onTime: stats[month].onTime,
          late: stats[month].late,
          notCompleted: stats[month].notCompleted
        }));
        setData(formatted);
      });
  }, []);

  return (
    <div style={{
      height: '100vh',
      width: '100vw',
      backgroundImage: 'url("/images/dashboard-preview.png")',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      position: 'relative',
      overflowY: 'auto',
      fontFamily: 'Arial, sans-serif',
      padding: '2rem'
    }}>
      <div style={{
        maxWidth: '800px',
        margin: '0 auto',
        backgroundColor: 'rgba(255,255,255,0.9)',
        padding: '2rem',
        borderRadius: '12px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
      }}>
        <button onClick={() => navigate('/')} style={{
          backgroundColor: '#6c757d',
          color: '#fff',
          padding: '0.5rem 1rem',
          borderRadius: '6px',
          border: 'none',
          marginBottom: '1rem',
          cursor: 'pointer'
        }}>← Back to My Tasks</button>

        <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>📊 Monthly Performance</h2>

        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={data}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="onTime" stackId="a" fill="#28a745" name="On Time" />
            <Bar dataKey="late" stackId="a" fill="#fd7e14" name="Late" />
            <Bar dataKey="notCompleted" stackId="a" fill="#dc3545" name="Not Completed" />
          </BarChart>
        </ResponsiveContainer>

        <div style={{ marginTop: '1rem', fontSize: '0.95rem', color: '#555' }}>
          <strong>Legend:</strong> <span style={{ color: '#28a745' }}>🟩 On Time</span>, 
          <span style={{ color: '#fd7e14' }}> 🟧 Late</span>, 
          <span style={{ color: '#dc3545' }}> 🟥 Not Completed</span>
        </div>
      </div>
    </div>
  );
}

export default PerformancePage;
