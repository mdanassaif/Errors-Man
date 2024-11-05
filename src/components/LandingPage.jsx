// LandingPage.jsx
import { useState, useCallback } from 'react';
import { Code, Users, ArrowRight, Shield, BookOpen } from 'lucide-react';
import { supabase } from '../lib/supabase';
import PropTypes from 'prop-types';
import Logo from '../../error.jpeg';
import ErrorBoundary from './ErrorBoundary.jsx';

const FEATURES = [
  {
    icon: Code,
    title: 'Quick Solutions',
    description: 'Find answers to your coding errors instantly',
    bgColor: 'bg-blue-50',
    iconColor: 'text-blue-600'
  },
  {
    icon: Users,
    title: 'Community Support',
    description: 'Connect with experienced developers',
    bgColor: 'bg-green-50',
    iconColor: 'text-green-600'
  },
  {
    icon: Shield,
    title: 'Secure Platform',
    description: 'Your data and interactions are protected',
    bgColor: 'bg-purple-50',
    iconColor: 'text-purple-600'
  },
  {
    icon: BookOpen,
    title: 'Learning Resources',
    description: 'Access comprehensive debugging guides',
    bgColor: 'bg-orange-50',
    iconColor: 'text-orange-600'
  }
];

const FeatureCard = ({ icon: Icon, title, description, bgColor, iconColor }) => (
  <div className="flex items-center gap-4 p-5 bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100">
    <div className={`p-3 ${bgColor} rounded-lg`}>
      <Icon className={`w-6 h-6 ${iconColor}`} />
    </div>
    <div>
      <h3 className="font-semibold text-gray-800 mb-1">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  </div>
);

export function LandingPage({ onUserSubmit }) {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    about: ''
  });
  const [isExistingUser, setIsExistingUser] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  }, []);

  const checkExistingUser = async (username) => {
    const { data, error } = await supabase
      .from('users')
      .select('username, password, about')
      .eq('username', username)
      .single();
    
    if (error) return null;
    return data;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmedUsername = formData.username.trim();
    const password = formData.password;

    // Validate required fields based on whether it's a new user or existing user
    if (!trimmedUsername || !password || (!isExistingUser && !formData.about.trim())) {
      setError('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      const existingUser = await checkExistingUser(trimmedUsername);

      if (existingUser) {
        // User exists
        if (!isExistingUser) {
          // First attempt - notify user to login
          setIsExistingUser(true);
          setError('Username exists. Please enter your password to login.');
          setLoading(false);
          return;
        }

        // Login attempt
        if (existingUser.password !== password) {
          setError('Incorrect password');
          setLoading(false);
          return;
        }

        // Successful login
        onUserSubmit(trimmedUsername);
      } else {
        // New user registration
        const { error: insertError } = await supabase
          .from('users')
          .insert([{ 
            username: trimmedUsername,
            password: password,
            about: formData.about.trim()
          }]);

        if (insertError) throw insertError;
        onUserSubmit(trimmedUsername);
      }
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
              <div className="flex items-center gap-3 mb-8 group">
                <img
                  src={Logo}
                  alt="ErrorsMan Logo"
                  className="h-12 w-12 md:h-16 md:w-16 rounded-lg transform group-hover:scale-110 transition-transform duration-300"
                />
                <h1 className="text-3xl md:text-5xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
                  ErrorsMan
                </h1>
              </div>

              <p className="text-lg md:text-xl text-gray-600 leading-relaxed mb-8 animate-fade-in">
                Your go-to platform for debugging solutions and coding knowledge. Join our community of developers helping each other succeed.
              </p>

              <div className="space-y-4 md:space-y-6">
                {FEATURES.map((feature, index) => (
                  <FeatureCard key={index} {...feature} />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Section - Sign Up/Login */}
        <div className="w-full lg:w-1/2 bg-gradient-to-br from-gray-900 to-gray-800 p-6 md:p-12 lg:p-16 flex items-center justify-center">
          <div className="w-full max-w-md">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-xl">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">
                {isExistingUser ? 'Welcome Back' : 'Start Your Journey'}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <label htmlFor="username" className="block text-sm font-medium text-gray-200 mb-2">
                      Username
                    </label>
                    <input
                      id="username"
                      name="username"
                      type="text"
                      placeholder="Enter your username"
                      className="w-full px-4 py-3 rounded-lg bg-white/20 text-white placeholder-gray-400 border border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition-all"
                      value={formData.username}
                      onChange={handleChange}
                      disabled={loading || isExistingUser}
                    />
                  </div>

                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-200 mb-2">
                      Password
                    </label>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      placeholder={isExistingUser ? "Enter your password" : "Create a password"}
                      className="w-full px-4 py-3 rounded-lg bg-white/20 text-white placeholder-gray-400 border border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition-all"
                      value={formData.password}
                      onChange={handleChange}
                      disabled={loading}
                    />
                  </div>

                  {/* Only show about field for new users */}
                  {!isExistingUser && (
                    <div>
                      <label htmlFor="about" className="block text-sm font-medium text-gray-200 mb-2">
                        About (10 words max)
                      </label>
                      <input
                        id="about"
                        name="about"
                        type="text"
                        placeholder="Brief description about yourself"
                        className="w-full px-4 py-3 rounded-lg bg-white/20 text-white placeholder-gray-400 border border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition-all"
                        value={formData.about}
                        onChange={(e) => {
                          const words = e.target.value.trim().split(/\s+/);
                          if (words.length <= 10) {
                            handleChange(e);
                          }
                        }}
                        disabled={loading}
                      />
                      <span className="text-xs text-gray-400 mt-1">
                        {formData.about.trim().split(/\s+/).length}/10 words
                      </span>
                    </div>
                  )}
                </div>

                {error && (
                  <div className="text-red-400 text-sm mt-2 bg-red-400/10 p-3 rounded-lg border border-red-400/20">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <span className="animate-spin">⟳</span>
                      Processing...
                    </div>
                  ) : (
                    <>
                      {isExistingUser ? 'Login' : 'Get Started'}
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>

                {isExistingUser && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsExistingUser(false);
                      setFormData(prev => ({
                        ...prev,
                        username: '',
                        password: '',
                        about: ''
                      }));
                      setError('');
                    }}
                    className="w-full text-center text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    Not you? Create new account
                  </button>
                )}
              </form>

              <p className="text-gray-400 text-sm text-center mt-8">
                By joining, you agree to our{' '}
                <a href="#" className="text-blue-400 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 rounded">
                  Terms
                </a>
                {' '}and{' '}
                <a href="#" className="text-blue-400 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 rounded">
                  Privacy Policy
                </a>
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

FeatureCard.propTypes = {
  icon: PropTypes.elementType.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  bgColor: PropTypes.string.isRequired,
  iconColor: PropTypes.string.isRequired,
};