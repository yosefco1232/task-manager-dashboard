import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import HomePage from './HomePage';
import TaskList from './TaskList';
import PerformancePage from './PerformancePage';

function App() {
  const [auth, setAuth] = useState(!!localStorage.getItem('token'));

  return (
    <BrowserRouter>
      <Routes>
        {!auth ? (
          <>
            <Route path="/" element={<HomePage onLogin={() => setAuth(true)} />} />
            <Route path="/home" element={<HomePage onLogin={() => setAuth(true)} />} />
          </>
        ) : (
          <>
            <Route
              path="/"
              element={
                <TaskList
                  onLogout={() => {
                    localStorage.removeItem('token');
                    setAuth(false);
                  }}
                />
              }
            />
            <Route path="/performance" element={<PerformancePage />} />
          </>
        )}
    </Routes>
    </BrowserRouter>
  );
}

export default App;
