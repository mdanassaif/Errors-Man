import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { LandingPage } from './components/LandingPage';
import ErrorsManPlatform from './components/ErrorsManPlatform';
import { GeneratePage } from './components/GeneratePage';
import { ChatPage } from './components/ChatPage';
import { Navigation } from './components/Navigation';
import { Analytics } from "@vercel/analytics/react"
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';
import QuestionDetail from './components/QuestionDetail'; 

function App() {
  const [showLanding, setShowLanding] = useState(true);
  const [username, setUsername] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [currentUser, setCurrentUser] = useState(
    localStorage.getItem('currentUser') || ''
  );

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setUsername(storedUsername);
      setShowLanding(false);
    }
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode);
  }, [isDarkMode]);

 

  return (
    <Router>
      <div className={`App ${isDarkMode ? 'dark' : ''}`}>
        <button
          onClick={() => setIsDarkMode(!isDarkMode)}
          className="fixed bottom-4 right-4 p-3 bg-yellow-500 text-white rounded-full shadow-lg hover:bg-yellow-600 transition-colors z-50"
        >
          {isDarkMode ? '🌙' : '☀️'}
        </button>
        <Routes>
        <Route path="/" element={
          currentUser ? 
            <ErrorsManPlatform initialUsername={currentUser} /> :
            <LandingPage onUserSubmit={(user) => {
              setCurrentUser(user);
              localStorage.setItem('currentUser', user);
            }} />
        }/>
        <Route path="/question/:id" element={
          <QuestionDetail currentUser={currentUser} />
        }/>
          <Route
            path="/ask"
            element={
              !showLanding ? (
                <>
                  {/* <Navigation /> */}
                  <ErrorsManPlatform initialUsername={username} />
                </>
              ) : (
                <Navigate to="/" replace />
              )
            }
          />
          <Route
            path="/generate"
            element={
              !showLanding ? (
                <>
                  <Navigation />
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
                <>
                  <Navigation />
                  <ChatPage />
                </>
              ) : (
                <Navigate to="/" replace />
              )
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
          <Route path="/question/:id" element={<QuestionDetail />} />
        </Routes>
        <Analytics />
        <ToastContainer position="bottom-right" />
      </div>
    </Router>
  );
}

export default App;