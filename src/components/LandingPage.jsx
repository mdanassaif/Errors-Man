import { useState } from 'react';
import { Code, Users } from 'lucide-react';
import { supabase } from '../lib/supabase';
import PropTypes from 'prop-types';
import Logo from '../../error.jpeg';
import { motion } from 'framer-motion';
import ErrorBoundary from './ErrorBoundary.jsx';

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
    <ErrorBoundary>
      <div className="min-h-screen flex flex-col md:flex-row font-sans">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full md:w-1/2 bg-white flex flex-col min-h-[50vh] md:min-h-screen"
        >
          <main className="flex-grow flex items-center justify-center p-8">
            <div className="max-w-md w-full">
              <h1 className="text-4xl sm:text-6xl font-extrabold text-black-900 mb-6 tracking-tight">
                About <span className="bg-clip-text text-transparent bg-gradient-to-r from-slate-300 to-slate-700 flex items-center">
                  ErrorsMan
                  <motion.img
                    whileHover={{ scale: 1.1 }}
                    src={Logo}
                    alt="ErrorsMan Logo"
                    className="h-14 w-auto ml-2"
                  />
                </span>
              </h1>
              <p className="text-black-600 mb-8 text-lg leading-relaxed">
                ErrorsMan is a community-driven platform where developers come together to solve errors,
                share knowledge, and support each other in their coding journey.
              </p>
              <div
               
                className="space-y-6"
              >
                <div
                   
                  className="flex items-center space-x-4 text-black-600 bg-gray-100 p-4 rounded-lg transition-all duration-300 hover:bg-gray-200"
                >
                  <Code className="w-8 h-8 text-gray-500" aria-hidden="true" />
                  <span className="text-lg">Find solutions to common coding errors</span>
                </div>
                <div
                   
                  className="flex items-center space-x-4 text-black-600 bg-gray-100 p-4 rounded-lg transition-all duration-300 hover:bg-gray-200"
                >
                  <Users className="w-8 h-8 text-gray-500" aria-hidden="true" />
                  <span className="text-lg">Connect with a supportive developer community</span>
                </div>
              </div>
            </div>
          </main>
        </motion.div>

        <div
          
          className="w-full md:w-1/2 bg-gradient-to-br from-gray-800 to-gray-900 flex flex-col min-h-[50vh] md:min-h-screen"
        >
          <main className="flex-grow flex items-center justify-center p-8">
            <div className="w-full max-w-md space-y-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="username" className="sr-only">Username</label>
                  <input
                    id="username"
                    type="text"
                    placeholder="Enter your username"
                    className="appearance-none rounded-lg relative block w-full px-4 py-3 border border-gray-600 bg-gray-300 placeholder-gray-500 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 text-lg"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    disabled={loading}
                    aria-invalid={error ? "true" : "false"}
                    aria-describedby={error ? "username-error" : undefined}
                  />
                  {error && <p id="username-error" className="text-red-400 text-sm mt-2" role="alert">{error}</p>}
                </div>

                <button
               
                  type="submit"
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg text-lg font-medium text-white bg-gradient-to-b from-slate-500 to-slate-800 hover:from-slate-400 hover:to-slate-600 focus:ring-slate-500 transition-all duration-300 disabled:opacity-50"
                  disabled={loading}
                  aria-label={loading ? "Loading" : "Start Solving"}
                >
                  {loading ? 'Loading...' : 'Start Solving'}
                </button>
              </form>
              <p className="text-center text-gray-400 mt-4">
                By joining, you agree to our Terms of Service and Privacy Policy.
              </p>
            </div>
          </main>
        </div>
      </div>
    </ErrorBoundary>
  );
}

 


 
