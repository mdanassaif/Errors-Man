import { Link, useLocation } from 'react-router-dom';
import { MessageCircleQuestion, Newspaper, MessageCircle } from 'lucide-react';

export function Navigation() {
  const location = useLocation();

  return (
    <nav className="bg-gradient-to-r from-yellow-500 to-yellow-600 shadow-lg backdrop-blur-sm bg-opacity-90">
      <div className="container mx-auto px-4 py-3">
        <ul className="flex justify-center space-x-8">
          <li>
            <Link
              to="/ask"
              className={`flex items-center space-x-2 text-white hover:bg-yellow-400/20 px-4 py-2 rounded-lg transition-all duration-300 relative group ${
                location.pathname === '/ask' ? 'bg-yellow-400/30' : ''
              }`}
            >
              <MessageCircleQuestion className="w-6 h-6" />
              <span>Ask</span>
              {location.pathname === '/ask' && (
                <span className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-4/5 h-1 bg-white rounded-full animate-pill"></span>
              )}
            </Link>
          </li>
          <li>
            <Link
              to="/generate"
              className={`flex items-center space-x-2 text-white hover:bg-yellow-400/20 px-4 py-2 rounded-lg transition-all duration-300 relative group ${
                location.pathname === '/generate' ? 'bg-yellow-400/30' : ''
              }`}
            >
              <Newspaper className="w-6 h-6" />
              <span>Generate</span>
              {location.pathname === '/generate' && (
                <span className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-4/5 h-1 bg-white rounded-full animate-pill"></span>
              )}
            </Link>
          </li>
          <li>
            <Link
              to="/chat"
              className={`flex items-center space-x-2 text-white hover:bg-yellow-400/20 px-4 py-2 rounded-lg transition-all duration-300 relative group ${
                location.pathname === '/chat' ? 'bg-yellow-400/30' : ''
              }`}
            >
              <MessageCircle className="w-6 h-6" />
              <span>Chat</span>
              {location.pathname === '/chat' && (
                <span className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-4/5 h-1 bg-white rounded-full animate-pill"></span>
              )}
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}