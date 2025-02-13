import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { LandingPage } from './components/LandingPage';
import ErrorsManPlatform from './components/ErrorsManPlatform';
import { Analytics } from "@vercel/analytics/react";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';
import QuestionDetail from './components/QuestionDetail';

function App() {
  const [showLanding, setShowLanding] = useState(true);
  const [username, setUsername] = useState('');
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

  return (
    <Router>
      <div className="App">
        {/* Advertisement Section */}
        <a
          href="https://freesvgicons.com/"  
          target="_blank"  
          rel="noopener noreferrer"  
          className="fixed bottom-4 right-4 p-3 bg-yellow-500 text-white rounded-full shadow-lg hover:bg-yellow-600 transition-colors z-50 flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path fill="currentColor" d="M12 0c-1.497 0-2.749.965-3.248 2.17a3.45 3.45 0 0 0-.238 1.416a3.459 3.459 0 0 0-1.168-.834a3.508 3.508 0 0 0-1.463-.256a3.513 3.513 0 0 0-2.367 1.02c-1.06 1.058-1.263 2.625-.764 3.83c.179.432.47.82.82 1.154a3.49 3.49 0 0 0-1.402.252C.965 9.251 0 10.502 0 12c0 1.497.965 2.749 2.17 3.248c.437.181.924.25 1.414.236c-.357.338-.65.732-.832 1.17c-.499 1.205-.295 2.772.764 3.83c1.058 1.06 2.625 1.263 3.83.764c.437-.181.83-.476 1.168-.832c-.014.49.057.977.238 1.414C9.251 23.035 10.502 24 12 24c1.497 0 2.749-.965 3.248-2.17a3.45 3.45 0 0 0 .238-1.416c.338.356.73.653 1.168.834c1.205.499 2.772.295 3.83-.764c1.06-1.058 1.263-2.625.764-3.83a3.459 3.459 0 0 0-.834-1.168a3.45 3.45 0 0 0 1.416-.238C23.035 14.749 24 13.498 24 12c0-1.497-.965-2.749-2.17-3.248a3.455 3.455 0 0 0-1.414-.236c.357-.338.65-.732.832-1.17c.499-1.205.295-2.772-.764-3.83a3.513 3.513 0 0 0-2.367-1.02a3.508 3.508 0 0 0-1.463.256c-.437.181-.83.475-1.168.832a3.45 3.45 0 0 0-.238-1.414C14.749.965 13.498 0 12 0zm-.041 1.613a1.902 1.902 0 0 1 1.387 3.246v3.893L16.098 6A1.902 1.902 0 1 1 18 7.902l-2.752 2.752h3.893a1.902 1.902 0 1 1 0 2.692h-3.893L18 16.098A1.902 1.902 0 1 1 16.098 18l-2.752-2.752v3.893a1.902 1.902 0 1 1-2.692 0v-3.893L7.902 18A1.902 1.902 0 1 1 6 16.098l2.752-2.752H4.859a1.902 1.902 0 1 1 0-2.692h3.893L6 7.902A1.902 1.902 0 1 1 7.902 6l2.752 2.752V4.859a1.902 1.902 0 0 1 1.305-3.246z"/></svg>
          <span className="text-sm">Free SVG Icons</span> {/* Advertisement name */}
        </a>

        <Routes>
          <Route
            path="/"
            element={
              currentUser ? (
                <ErrorsManPlatform initialUsername={currentUser} />
              ) : (
                <LandingPage
                  onUserSubmit={(user) => {
                    setCurrentUser(user);
                    localStorage.setItem('currentUser', user);
                  }}
                />
              )
            }
          />
          <Route
            path="/question/:id"
            element={<QuestionDetail currentUser={currentUser} />}
          />
          <Route
            path="/ask"
            element={
              !showLanding ? (
                <>
                  <ErrorsManPlatform initialUsername={username} />
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