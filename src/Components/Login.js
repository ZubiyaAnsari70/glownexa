import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { auth } from './firebase'; // Same components folder

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [emailError, setEmailError] = useState('');
  
  // Forgot password states
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
  const [forgotPasswordLoading, setForgotPasswordLoading] = useState(false);
  const [forgotPasswordMessage, setForgotPasswordMessage] = useState('');
  const [forgotPasswordError, setForgotPasswordError] = useState('');
  const [forgotEmailError, setForgotEmailError] = useState('');

  // Email validation function
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Real-time email validation for login form
    if (name === 'email') {
      if (value && !validateEmail(value)) {
        setEmailError('Please enter a valid email address');
      } else {
        setEmailError('');
      }
    }
  };

  // Handle forgot password email validation
  const handleForgotEmailChange = (e) => {
    const email = e.target.value;
    setForgotPasswordEmail(email);
    
    if (email && !validateEmail(email)) {
      setForgotEmailError('Please enter a valid email address');
    } else {
      setForgotEmailError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validate email before submission
    if (!validateEmail(formData.email)) {
      setEmailError('Please enter a valid email address');
      setLoading(false);
      return;
    }

    try {
      // Sign in directly with email and password
      const userCredential = await signInWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;
      
      // Check if email is verified
      if (!user.emailVerified) {
        setError('Please verify your email before logging in. Check your inbox for verification link.');
        return;
      }
      
      console.log('User logged in successfully');
      localStorage.setItem("isAuthenticated", "true");
      navigate("/"); // Use React Router navigate instead of window.location
      
    } catch (error) {
      console.error('Login error:', error);
      
      // Better error messages
      switch (error.code) {
        case 'auth/user-not-found':
          setError('No account found with this email address.');
          break;
        case 'auth/wrong-password':
          setError('Incorrect password. Please try again.');
          break;
        case 'auth/invalid-email':
          setError('Please enter a valid email address.');
          break;
        case 'auth/user-disabled':
          setError('This account has been disabled.');
          break;
        case 'auth/too-many-requests':
          setError('Too many failed attempts. Please try again later.');
          break;
        case 'auth/invalid-credential':
          setError('Invalid email or password. Please check your credentials.');
          break;
        default:
          setError('Login failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setForgotPasswordLoading(true);
    setForgotPasswordError('');
    setForgotPasswordMessage('');
  
    // Validate email before sending reset
    if (!validateEmail(forgotPasswordEmail)) {
      setForgotEmailError('Please enter a valid email address');
      setForgotPasswordLoading(false);
      return;
    }
  
    try {
      // Option 1: Simple reset without custom URL (Recommended)
      await sendPasswordResetEmail(auth, forgotPasswordEmail);
      
      // Option 2: With custom action settings (if needed)
      /*
      await sendPasswordResetEmail(auth, forgotPasswordEmail, {
        url: 'https://glownexa-7688e.firebaseapp.com/login', // Your actual domain
        handleCodeInApp: false
      });
      */
      
      setForgotPasswordMessage('Password reset email sent! Please check your inbox and spam folder.');
      
      // Clear the email field after successful send
      setTimeout(() => {
        setForgotPasswordEmail('');
      }, 2000);
      
    } catch (error) {
      console.error('Forgot password error:', error);
      
      switch (error.code) {
        case 'auth/user-not-found':
          setForgotPasswordError('No account found with this email address.');
          break;
        case 'auth/invalid-email':
          setForgotPasswordError('Please enter a valid email address.');
          break;
        case 'auth/too-many-requests':
          setForgotPasswordError('Too many requests. Please try again later.');
          break;
        default:
          setForgotPasswordError('Failed to send reset email. Please try again.');
      }
    } finally {
      setForgotPasswordLoading(false);
    }
  };

  const closeForgotPasswordModal = () => {
    setShowForgotPassword(false);
    setForgotPasswordEmail('');
    setForgotPasswordMessage('');
    setForgotPasswordError('');
    setForgotEmailError('');
  };

  return (
    <div className="h-screen relative overflow-hidden flex items-center justify-center">
      {/* Static Light Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-100 via-purple-50 to-pink-100"></div>
      
      {/* Floating Animated Objects */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Large floating circles */}
        <div className="absolute top-10 left-10 w-64 h-64 bg-blue-200 bg-opacity-20 rounded-full blur-xl animate-float"></div>
        <div className="absolute top-32 right-20 w-80 h-80 bg-purple-200 bg-opacity-15 rounded-full blur-2xl animate-float-delayed"></div>
        <div className="absolute bottom-20 left-1/4 w-72 h-72 bg-pink-200 bg-opacity-20 rounded-full blur-xl animate-pulse-slow"></div>
        
        {/* Medium floating shapes */}
        <div className="absolute top-1/4 left-1/2 w-48 h-48 bg-indigo-200 bg-opacity-15 rounded-full blur-lg animate-bounce-slow"></div>
        <div className="absolute bottom-1/3 right-1/4 w-56 h-56 bg-violet-200 bg-opacity-20 rounded-full blur-xl animate-float-reverse"></div>
        
        {/* Small animated dots */}
        <div className="absolute top-20 left-1/3 w-16 h-16 bg-blue-300 bg-opacity-40 rounded-full animate-ping"></div>
        <div className="absolute bottom-40 right-1/3 w-12 h-12 bg-purple-300 bg-opacity-50 rounded-full animate-pulse"></div>
        <div className="absolute top-1/2 left-20 w-20 h-20 bg-pink-300 bg-opacity-35 rounded-full animate-bounce"></div>
        
        {/* Geometric shapes */}
        <div className="absolute top-1/3 right-10 w-32 h-32 bg-gradient-to-r from-blue-300 to-purple-400 opacity-30 transform rotate-45 animate-spin-slow"></div>
        <div className="absolute bottom-1/4 left-1/3 w-24 h-24 bg-gradient-to-r from-indigo-300 to-pink-400 opacity-35 transform rotate-12 animate-wiggle"></div>
      </div>

      {/* Glass container - Transparent */}
      <div className="relative z-10 w-11/12 md:w-4/5 max-w-6xl bg-white/10 backdrop-blur-lg rounded-xl shadow-2xl flex flex-col md:flex-row overflow-hidden h-[50vh] border border-white/30">
        
        {/* Left Section with Light Gradient */}
        <div className="w-full md:w-1/2 h-full hidden md:block relative overflow-hidden">
          {/* Light gradient background */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-200 via-purple-200 to-pink-200"></div>
          <div className="absolute inset-0 bg-gradient-to-tl from-indigo-100 via-transparent to-transparent opacity-60"></div>
          
          {/* Animated overlay patterns */}
          <div className="absolute inset-0">
            <div className="absolute top-1/4 left-1/4 w-32 h-32 border-2 border-white/50 rounded-full animate-pulse"></div>
            <div className="absolute bottom-1/4 right-1/4 w-24 h-24 bg-white/30 rounded-full animate-ping"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 border-4 border-white/40 rounded-full animate-spin-slow"></div>
            <div className="absolute top-16 right-16 w-16 h-16 bg-blue-300/40 rotate-45 animate-bounce"></div>
          </div>
          
          {/* Welcome content */}
          <div className="relative z-10 h-full flex items-center justify-center text-gray-800 text-center">
            <div>
              <h1 className="text-4xl font-bold mb-4 animate-fade-in">Welcome Back!</h1>
              <p className="text-xl opacity-80 animate-slide-up">Sign in to continue</p>
            </div>
          </div>
        </div>

        {/* Right Form Section - Transparent */}
        <div className="w-full md:w-1/2 p-8 text-gray-800 flex items-center h-full relative">
          <div className="w-full px-10 relative z-10">
            <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Sign In</h2>
            
            {error && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block mb-1 font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 rounded-lg bg-white backdrop-blur-sm text-gray-800 placeholder-gray-600 outline-none focus:ring-2 transition-all duration-300 border ${
                    emailError 
                      ? 'border-red-400 focus:ring-red-400/50' 
                      : 'border-white/40 focus:ring-blue-400/50'
                  } focus:bg-white/30`}
                  placeholder="Enter your email"
                  required
                />
                {emailError && (
                  <p className="mt-1 text-sm text-red-600">{emailError}</p>
                )}
              </div>
              
              <div>
                <label className="block mb-1 font-medium text-gray-700">Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-lg bg-white backdrop-blur-sm text-gray-800 placeholder-gray-600 outline-none focus:ring-2 focus:ring-blue-400/50 focus:bg-white/30 transition-all duration-300 border border-white/40"
                  placeholder="Enter password"
                  required
                />
              </div>
              
              <button
                type="submit"
                disabled={loading || emailError}
                className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {loading ? 'Signing In...' : 'Login'}
              </button>
              
              <div className="w-full flex items-center justify-center mt-6">
                <p className="text-sm text-gray-600">
                  Don't have an account?{" "}
                  <a
                    href="/register"
                    className="font-medium text-indigo-600 hover:underline focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    Sign Up here
                  </a>
                </p>
              </div>
              
              {/* Forgot Password Link */}
              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setShowForgotPassword(true)}
                  className="text-sm text-indigo-600 hover:text-indigo-800 hover:underline focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors duration-200"
                >
                  Forgot Password?
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotPassword && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white/20 backdrop-blur-lg rounded-xl p-8 w-11/12 max-w-md border border-white/30 shadow-2xl">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Reset Password</h3>
              <p className="text-gray-600">Enter your email to reset password</p>
            </div>

            {forgotPasswordMessage && (
              <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg text-center">
                {forgotPasswordMessage}
              </div>
            )}

            {forgotPasswordError && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-center">
                {forgotPasswordError}
              </div>
            )}

            <form onSubmit={handleForgotPassword} className="space-y-4">
              <div>
                <label className="block mb-2 font-medium text-gray-700">Email Address</label>
                <input
                  type="email"
                  value={forgotPasswordEmail}
                  onChange={handleForgotEmailChange}
                  className={`w-full px-4 py-3 rounded-lg bg-white/70 backdrop-blur-sm text-gray-800 placeholder-gray-600 outline-none focus:ring-2 transition-all duration-300 border ${
                    forgotEmailError 
                      ? 'border-red-400 focus:ring-red-400/50' 
                      : 'border-white/40 focus:ring-blue-400/50'
                  } focus:bg-white/90`}
                  placeholder="Enter your email address"
                  required
                />
                {forgotEmailError && (
                  <p className="mt-1 text-sm text-red-600">{forgotEmailError}</p>
                )}
              </div>
              
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={closeForgotPasswordModal}
                  className="flex-1 py-3 bg-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-400 transition-all duration-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={forgotPasswordLoading || forgotEmailError}
                  className="flex-1 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {forgotPasswordLoading ? 'Sending...' : 'Send Reset Email'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Additional floating elements for more animation */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-blue-400 rounded-full animate-twinkle"></div>
        <div className="absolute top-3/4 right-1/4 w-3 h-3 bg-purple-400 rounded-full animate-twinkle-delayed"></div>
        <div className="absolute top-1/2 right-1/2 w-2 h-2 bg-pink-400 rounded-full animate-twinkle"></div>
      </div>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          25% { transform: translateY(-20px) translateX(10px); }
          50% { transform: translateY(-10px) translateX(-10px); }
          75% { transform: translateY(-25px) translateX(5px); }
        }

        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px) translateX(0px) rotate(0deg); }
          33% { transform: translateY(-15px) translateX(-15px) rotate(120deg); }
          66% { transform: translateY(-30px) translateX(10px) rotate(240deg); }
        }

        @keyframes float-reverse {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          50% { transform: translateY(20px) translateX(-20px); }
        }

        @keyframes pulse-slow {
          0%, 100% { opacity: 0.1; transform: scale(1); }
          50% { opacity: 0.3; transform: scale(1.1); }
        }

        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-30px); }
        }

        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes wiggle {
          0%, 100% { transform: rotate(12deg); }
          25% { transform: rotate(18deg); }
          75% { transform: rotate(6deg); }
        }

        @keyframes twinkle {
          0%, 100% { opacity: 0; transform: scale(0); }
          50% { opacity: 1; transform: scale(1); }
        }

        @keyframes twinkle-delayed {
          0%, 100% { opacity: 0; transform: scale(0); }
          50% { opacity: 1; transform: scale(1.2); }
        }

        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes slide-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }

        .animate-float-delayed {
          animation: float-delayed 8s ease-in-out infinite 2s;
        }

        .animate-float-reverse {
          animation: float-reverse 5s ease-in-out infinite 1s;
        }

        .animate-pulse-slow {
          animation: pulse-slow 4s ease-in-out infinite;
        }

        .animate-bounce-slow {
          animation: bounce-slow 3s ease-in-out infinite 1.5s;
        }

        .animate-spin-slow {
          animation: spin-slow 15s linear infinite;
        }

        .animate-wiggle {
          animation: wiggle 2s ease-in-out infinite;
        }

        .animate-twinkle {
          animation: twinkle 3s ease-in-out infinite;
        }

        .animate-twinkle-delayed {
          animation: twinkle-delayed 4s ease-in-out infinite 2s;
        }

        .animate-fade-in {
          animation: fade-in 1.5s ease-out 0.5s both;
        }

        .animate-slide-up {
          animation: slide-up 1.5s ease-out 1s both;
        }
      `}</style>
    </div>
  );
};

export default Login;