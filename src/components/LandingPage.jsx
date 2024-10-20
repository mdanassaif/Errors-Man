import { useState } from 'react';
import { Code, Users } from 'lucide-react';
import { supabase } from '../lib/supabase';
import PropTypes from 'prop-types';
import Logo from '../../error.jpeg';

LandingPage.propTypes = {
  onUserSubmit: PropTypes.func.isRequired,
};

export function LandingPage({ onUserSubmit }) {
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim()) {
      setError('Please enter a username');
      return;
    }

    setLoading(true);
    try {
      const { error: dbError } = await supabase
        .from('users')
        .insert([{ username: username.trim() }]);

      if (dbError) throw dbError;

      onUserSubmit(username);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <div className="w-full md:w-1/2 bg-white flex flex-col min-h-[50vh] md:min-h-screen">
        <header className="bg-white shadow-sm p-4">
          <div className="flex items-center space-x-2">
            <img src={Logo} alt="Logo" className="h-8 w-auto" />
            <h1 className="text-2xl font-bold text-blue-600">Errors Man </h1>
          </div>
        </header>

        <main className="flex-grow flex items-center justify-center p-8">
          <div className="max-w-md w-full">
            <h2 className="text-3xl font-extrabold text-blue-900 mb-4">About ErrorsMan</h2>
            <p className="text-blue-600 mb-6">
              ErrorsMan is a community-driven platform where developers come together to solve errors,
              share knowledge, and support each other in their coding journey.
            </p>
            <div className="space-y-4">
              <div className="flex items-center space-x-2 text-blue-600">
                <Code className="w-5 h-5" />
                <span>Find solutions to common coding errors</span>
              </div>
              <div className="flex items-center space-x-2 text-blue-600">
                <Users className="w-5 h-5" />
                <span>Connect with a supportive developer community</span>
              </div>
            </div>
          </div>
        </main>

      
      </div>

      <div className="w-full md:w-1/2 bg-gray-800 flex flex-col min-h-[50vh] md:min-h-screen">
       

        <main className="flex-grow flex items-center justify-center p-8">
          <div className="w-full max-w-md">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-1">
                  Username
                </label>
                <input
                  id="username"
                  type="text"
                  placeholder="Enter your username"
                  className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-600 bg-gray-700 placeholder-gray-400 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={loading}
                />
                {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
              </div>

              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:bg-blue-400"
                disabled={loading}
              >
                {loading ? 'Loading...' : 'Start Solving'}
              </button>
            </form>
          </div>
        </main>

        <footer className="bg-gray-800 p-4 text-center text-sm text-gray-400">
           2024 ErrorsMan. All rights reserved.
        </footer>
       
      </div>
    </div>
  );
}