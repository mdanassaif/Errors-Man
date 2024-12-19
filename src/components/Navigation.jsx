 
import { Link } from 'react-router-dom';
import { MessageCircleQuestion, Newspaper, MessageCircle } from 'lucide-react';

export function Navigation() {
  return (
    <nav className="bg-gradient-to-r from-yellow-500 to-yellow-600 shadow-md text-gray font-semibold py-4">
      <div className="container mx-auto px-4 py-2">
        <ul className="flex space-x-4 justify-center gap-5">
          <li>
            <Link 
              to="/ask" 
              className="flex items-center space-x-2 hover:text-gray-600 transition"
            >
              <MessageCircleQuestion className="w-5 h-5" />
              <span>Ask</span>
            </Link>
          </li>
          <li>
            <Link 
              to="/generate" 
              className="flex items-center space-x-2 hover:text-gray-600 transition"
            >
              <Newspaper className="w-5 h-5" />
              <span>Generate</span>
            </Link>
          </li>
          <li>
            <Link 
              to="/chat" 
              className="flex items-center space-x-2 hover:text-gray-600 transition"
            >
              <MessageCircle className="w-5 h-5" />
              <span>Chat</span>
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}