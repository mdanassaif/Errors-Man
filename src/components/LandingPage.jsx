import { useState } from 'react';
import { Code, Users, ArrowRight } from 'lucide-react';
import { supabase } from '../lib/supabase';
import PropTypes from 'prop-types';
import Logo from '../../error.jpeg';
import ErrorBoundary from './ErrorBoundary.jsx';

export function LandingPage({ onUserSubmit }) {
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmedUsername = username.trim();

    if (!trimmedUsername) {
      setError('Please enter a username');
      return;
    }

    setLoading(true);
    try {
      const { error: dbError } = await supabase
        .from('users')
        .insert([{ username: trimmedUsername }]);

      if (dbError) throw dbError;
      onUserSubmit(trimmedUsername);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen flex flex-col lg:flex-row">
        {/* Left Section - About */}
        <div className="w-full lg:w-1/2 bg-gradient-to-b from-white to-gray-50 p-6 md:p-12 lg:p-16">
          <div className="max-w-xl mx-auto">
            <div className="mb-12">
              <div className="flex items-center gap-3 mb-8">
                <img
                  src={Logo}
                  alt="ErrorsMan Logo"
                  className="h-12 w-12 md:h-16 md:w-16 rounded-lg shadow-lg transform hover:scale-105 transition-transform"
                />
                <h1 className="text-3xl md:text-5xl font-bold text-gray-800">
                  ErrorsMan
                </h1>
              </div>

              <p className="text-lg md:text-xl text-gray-600 leading-relaxed mb-8">
                Your go-to platform for debugging solutions and coding knowledge. Join our community of developers helping each other succeed.
              </p>

              <div className="space-y-4 md:space-y-6">
                <div className="flex items-center gap-4 p-5 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <Code className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-1">Quick Solutions</h3>
                    <p className="text-gray-600">Find answers to your coding errors instantly</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-5 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100">
                  <div className="p-3 bg-green-50 rounded-lg">
                    <Users className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-1">Community Support</h3>
                    <p className="text-gray-600">Connect with experienced developers</p>
                  </div>
                </div>


              </div>
            </div>
          </div>
        </div>

        {/* Right Section - Sign Up */}
        <div className="w-full lg:w-1/2 bg-gradient-to-br from-gray-900 to-gray-800 p-6 md:p-12 lg:p-16 flex items-center justify-center">
          <div className="w-full max-w-md">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-xl">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">
                Start Your Journey
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-gray-200 mb-2">
                    Username
                  </label>
                  <input
                    id="username"
                    type="text"
                    placeholder="Enter your username"
                    className="w-full px-4 py-3 rounded-lg bg-white/20 text-white placeholder-gray-400 border border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition-all"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    disabled={loading}
                  />
                  {error && (
                    <p className="text-red-400 text-sm mt-2 bg-red-400/10 p-2 rounded-lg">
                      {error}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-medium transition-all disabled:opacity-50"
                >
                  {loading ? (
                    'Processing...'
                  ) : (
                    <>
                      Get Started
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </form>

              <p className="text-gray-400 text-sm text-center mt-8">
                By joining, you agree to our{' '}
                <a href="#" className="text-blue-400 hover:underline">Terms</a>
                {' '}and{' '}
                <a href="#" className="text-blue-400 hover:underline">Privacy Policy</a>
              </p>
            </div>


          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
}

LandingPage.propTypes = {
  onUserSubmit: PropTypes.func.isRequired,
};