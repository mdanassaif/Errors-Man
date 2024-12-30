import  { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { LandingPage } from './components/LandingPage';
import ErrorsManPlatform from './components/ErrorsManPlatform';
import { GeneratePage } from './components/GeneratePage';
import { ChatPage } from './components/ChatPage';
import { Navigation } from './components/Navigation';
import './App.css';
import { Analytics } from "@vercel/analytics/react"

function App() {
  const [showLanding, setShowLanding] = useState(true);
  const [username, setUsername] = useState('');

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setUsername(storedUsername);
      setShowLanding(false);
    }
  }, []);

  const handleUserSubmit = (name) => {
    setUsername(name);
    setShowLanding(false);
    localStorage.setItem('username', name);
  };

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route 
            path="/" 
            element={
              showLanding ? (
                <LandingPage onUserSubmit={handleUserSubmit} />
              ) : (
                <Navigate to="/ask" replace />
              )
            } 
          /> 
          <Route 
            path="/ask" 
            element={
              !showLanding ? (
                <> <Navigation/> <ErrorsManPlatform initialUsername={username} /></>
               
              ) : (
                <Navigate to="/" replace />
              )
            } 
          />
          <Route 
            path="/generate" 
            element={
              !showLanding ? (
                <> <Navigation/>
                <GeneratePage />
                </>
              ) : (
                <Navigate to="/" replace />
              )
            } 
          />
          <Route 
            path="/chat" 
            element={
              !showLanding ? (
                <> <Navigation/>
                <ChatPage />
                </>
              ) : (
                <Navigate to="/" replace />
              )
            } 
          />
          <Route 
            path="*" 
            element={<Navigate to="/" replace />} 
          />
        </Routes>
      </div>
      <Analytics/>
    </Router>
    
  );
}

export default App;