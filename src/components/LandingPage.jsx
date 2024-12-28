import { useState, useCallback, useEffect } from "react";
import PropTypes from "prop-types";
import { motion } from "framer-motion";
import { supabase } from "../lib/supabase";
import { Loader2, ArrowRight } from "lucide-react";
import Logo from "../../error.jpeg";

import { FEATURES } from "../data/constants";
import FeatureDetailSlider from "./FeatureDetailSlider";
import './Landing.css';

export  const LandingPage =({ onUserSubmit }) => {
  const [isSignUp, setIsSignUp] = useState(true);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    about: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeFeature, setActiveFeature] = useState(0);

  useEffect(() => {
    const styleElement = document.getElementById('no-scrollbar');
    if (styleElement) {
      styleElement.remove();
    }
  }, []);

  // Auto-slide feature images
  useEffect(() => {
    const slideTimer = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % FEATURES.length);
    }, 5000);

    return () => clearInterval(slideTimer);
  }, []);

  // Form input change handler
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
  }, []);

  // Advanced form validation
  const validateForm = () => {
    const { username, password, about } = formData;
    const errors = {};

    if (!username.trim()) errors.username = "Username is required";
    if (username.length < 3)
      errors.username = "Username must be at least 3 characters";
    if (!password.trim()) errors.password = "Password is required";
    if (password.length < 6)
      errors.password = "Password must be at least 6 characters";

    if (isSignUp) {
      if (!about.trim()) errors.about = "About section is required";
      if (about.trim().split(/\s+/).length > 10)
        errors.about = "About section must be 10 words or less";
    }

    return errors;
  };

  // Check existing user
  const checkExistingUser = async (username) => {
    const { data, error } = await supabase
      .from("users")
      .select("username")
      .eq("username", username)
      .single();

    if (error) return null;
    return data;
  };

  // Form submission handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formErrors = validateForm();

    if (Object.keys(formErrors).length > 0) {
      setError(Object.values(formErrors)[0]);
      return;
    }

    setLoading(true);
    try {
      const trimmedUsername = formData.username.trim();
      const existingUser = await checkExistingUser(trimmedUsername);

      if (isSignUp) {
       
        if (existingUser) {
          setError("Username already exists. Please choose another.");
          setLoading(false);
          return;
        }

         
        const { error: insertError } = await supabase.from("users").insert([
          {
            username: trimmedUsername,
            password: formData.password,  
            about: formData.about.trim(),
          },
        ]);

        if (insertError) throw insertError;
        onUserSubmit(trimmedUsername);
      } else {
        // Sign In Logic
        if (!existingUser) {
          setError("User not found. Please sign up first.");
          setLoading(false);
          return;
        }

        onUserSubmit(trimmedUsername);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="h-screen flex flex-col lg:flex-row"
    >
      {/* Left Section - Sign Up/Sign In Form */}
      <div className="w-full lg:w-1/2 bg-gradient-to-br from-gray-900 to-gray-800 p-6 md:p-12 lg:p-16 flex items-center justify-center ">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold text-white mb-4">
              {isSignUp ? "Create Your Account" : "Welcome Back"}
            </h1>
            <p className="text-gray-300">
              {isSignUp
                ? "Join developer community and solve all coding errors."
                : "Sign in to continue your coding journey"}
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8">
            <div className="flex justify-center mb-6">
              <button
                onClick={() => setIsSignUp(true)}
                className={`mr-4 px-4 py-2 rounded-lg ${
                  isSignUp ? "bg-gray-800 text-white" : "text-gray-400"
                }`}
              >
                Sign Up
              </button>
              <button
                onClick={() => setIsSignUp(false)}
                className={`px-4 py-2 rounded-lg ${
                  !isSignUp ? "bg-gray-800 text-white" : "text-gray-400"
                }`}
              >
                Sign In
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="username"
                    className="block text-sm font-medium text-gray-200 mb-2"
                  >
                    Username
                  </label>
                  <input
                    id="username"
                    name="username"
                    type="text"
                    placeholder="Enter your username"
                    className="w-full px-4 py-3 rounded-lg bg-white/20 text-white placeholder-gray-400 border border-gray-600 focus:border-gray-500 focus:ring-2 focus:ring-gray-500 transition-all"
                    value={formData.username}
                    onChange={handleChange}
                    disabled={loading}
                  />
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-200 mb-2"
                  >
                    Password
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    placeholder={
                      isSignUp ? "Create a password" : "Enter your password"
                    }
                    className="w-full px-4 py-3 rounded-lg bg-white/20 text-white placeholder-gray-400 border border-gray-600 focus:border-gray-500 focus:ring-2 focus:ring-gray-500 transition-all"
                    value={formData.password}
                    onChange={handleChange}
                    disabled={loading}
                  />
                </div>

                {isSignUp && (
                  <div>
                    <label
                      htmlFor="about"
                      className="block text-sm font-medium text-gray-200 mb-2"
                    >
                      About (10 words max)
                    </label>
                    <input
                      id="about"
                      name="about"
                      type="text"
                      placeholder="Brief description about yourself"
                      className="w-full px-4 py-3 rounded-lg bg-white/20 text-white placeholder-gray-400 border border-gray-600 focus:border-gray-500 focus:ring-2 focus:ring-gray-500 transition-all"
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
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg bg-gray-800 hover:from-gray-500 hover:to-gray-600 text-white font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Processing...
                  </div>
                ) : (
                  <>
                    {isSignUp ? "Sign Up" : "Sign In"}
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>

             
          </div>
        </div>
      </div>

      {/* Right Section - Features Showcase */}
      <div  className="landing-right w-full h-screen lg:w-1/2 bg-gradient-to-b from-white to-gray-50 p-6 md:p-12 lg:p-16">
        <div className="max-w-xl mx-auto">
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-8 group">
              <img
                src={Logo}
                alt="ErrorsMan Logo"
                className="h-12 w-12 md:h-16 md:w-16 rounded-lg transform group-hover:scale-110 transition-transform duration-300"
              />
              <h1 className="text-3xl md:text-5xl font-bold text-gray-800 group-hover:text-gray-600 transition-colors">
                ErrorsMan
              </h1>
            </div>
            <p className="text-lg text-gray-600 mb-8">
              Your go-to platform for debugging solutions and coding knowledge.
              Join our community of developers helping each other succeed.
            </p>

            <FeatureDetailSlider
              features={FEATURES}
              activeFeature={activeFeature}
            />

            <div className="flex justify-center mt-6 space-x-4 pb-10">
              {FEATURES.map((feature, index) => (
                <button
                  key={index}
                  onClick={() => setActiveFeature(index)}
                  className={`w-12 h-2 rounded-full transition-all duration-300 ${
                    activeFeature === index
                      ? "bg-gray-600 w-16"
                      : "bg-gray-300 hover:bg-gray-400"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// PropTypes 
LandingPage.propTypes = {
  onUserSubmit: PropTypes.func.isRequired,
};

export default LandingPage;
