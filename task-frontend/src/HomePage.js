import React, { useState } from 'react';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';

function HomePage({ onLogin }) {
  const [view, setView] = useState(null);

  return (
    <div style={{
      height: '100vh',
      width: '100vw',
      backgroundImage: 'url("/images/dashboard-preview.png")',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      position: 'relative',
      fontFamily: 'Arial, sans-serif',
      color: '#fff',
      overflow: 'hidden'
    }}>
      
     {/* Main Left Content */}
<div style={{
  position: 'absolute',
  top: '18%',
  left: '2%',
  zIndex: 1,
  maxWidth: '900px'
}}>
    <div style={{
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        padding: '1.5rem',
        borderRadius: '12px',
        backdropFilter: 'blur(6px)',
        WebkitBackdropFilter: 'blur(6px)',
        color: '#fff'
    }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
        <img src="/images/mylogo.png" alt="Logo" style={{ width: '48px', height: '48px' }} />
        <h1 style={{ fontSize: '3rem', margin: 0 }}>Task Manager</h1>
        </div>

        <p style={{ fontSize: '1.2rem', lineHeight: '1.6', marginBottom: '1rem' }}>
        From clutter to clarity.<br />
        Organize your goals and get things done — fast, simple, and beautiful.
        </p>

        <ul style={{
        fontSize: '1.1rem',
        lineHeight: '1.6',
        paddingLeft: '1.5rem',
        margin: 0
        }}>
        <li>✅ Easily add tasks and keep track of everything in one place</li>
        <li>📌 Mark each task as completed, delayed, or missed</li>
        <li>📊 View monthly performance statistics to improve your productivity</li>
        <li>📧 Get email reminders the day before your deadlines</li>
        </ul>
     </div>
    </div>
      {/* Top-Right Auth Box */}
      <div style={{
        position: 'absolute',
        top: '2rem',
        right: '2rem',
        backgroundColor: '#ffffffcc',
        borderRadius: '12px',
        padding: '2rem',
        width: '300px',
        boxShadow: '0 6px 12px rgba(0,0,0,0.2)',
        zIndex: 3
      }}>
        {!view && (
          <>
            <h3 style={{ marginBottom: '1rem', color: '#333' }}>Get Started</h3>
            <button onClick={() => setView('signup')} style={{
              width: '100%',
              padding: '0.75rem',
              marginBottom: '0.5rem',
              backgroundColor: '#28a745',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer'
            }}>Sign Up</button>
            <button onClick={() => setView('login')} style={{
              width: '100%',
              padding: '0.75rem',
              backgroundColor: '#007bff',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer'
            }}>Log In</button>
          </>
        )}

        {view === 'signup' && (
          <SignupForm
            onSignup={() => setView('login')}
            onBack={() => setView(null)}
          />
        )}

        {view === 'login' && (
          <LoginForm
            onLogin={onLogin}
            onBack={() => setView(null)}
          />
        )}
      </div>
    </div>
  );
}

export default HomePage;
