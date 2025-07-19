import React, { useState } from 'react';

function SignupForm({ onSignup, onBack }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignup = async (e) => {
    e.preventDefault();
    const res = await fetch('http://localhost:3000/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    if (res.status === 200 || res.status === 201) {
      onSignup();
    }
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem',
      padding: '2rem',
      backgroundColor: '#ffffff',
      borderRadius: '10px',
      boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
      width: '100%',
      maxWidth: '400px'
    }}>
      <button onClick={onBack} style={{
        background: 'transparent',
        border: 'none',
        color: '#007bff',
        textAlign: 'left',
        cursor: 'pointer'
      }}>← Back</button>

      <h2 style={{ marginBottom: '1rem', color: '#333' }}>Sign Up</h2>

      <form onSubmit={handleSignup} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          style={{ padding: '0.75rem', borderRadius: '6px', border: '1px solid #ccc' }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          style={{ padding: '0.75rem', borderRadius: '6px', border: '1px solid #ccc' }}
        />
        <button type="submit" style={{
          padding: '0.75rem',
          backgroundColor: '#28a745',
          color: '#fff',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer'
        }}>Sign Up</button>
      </form>
    </div>
  );
}

export default SignupForm;
