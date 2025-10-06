import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';

import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from './firebase'; // Same components folder

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPasswordRequirements, setShowPasswordRequirements] = useState(false);
  const navigate = useNavigate();

  // Password validation function
  const validatePassword = (password) => {
    const requirements = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    };
    
    const isValid = Object.values(requirements).every(req => req);
    
    return { requirements, isValid };
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Show password requirements when user starts typing password
    if (name === 'password') {
      setShowPasswordRequirements(value.length > 0);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validate password before submitting
    const passwordValidation = validatePassword(formData.password);
    if (!passwordValidation.isValid) {
      setError('Password does not meet all requirements');
      setLoading(false);
      return;
    }
   
    // Firebase built-in verification page configuration
    const actionCodeSettings = {
      url: 'https://glownexa.vercel.app/login', // Where to redirect after verification
      handleCodeInApp: false, // Use Firebase's built-in page, not your app
    };

    try {
      // Create user with email and password
      const userCredential = await createUserWithEmailAndPassword(
        auth, 
        formData.email, 
        formData.password
      );
      
      const user = userCredential.user;
      
      // Save additional user data to Firestore first
      await setDoc(doc(db, 'users', user.uid), {
        username: formData.username,
        email: formData.email,
        createdAt: new Date().toISOString(),
        uid: user.uid
      });

      // Send email verification
      await sendEmailVerification(user, actionCodeSettings);

      // Clear form fields
      setFormData({ username: "", email: "", password: "" });

      console.log('User registered successfully');
      
      // Redirect to verify email page
      navigate("/verify");
      
    } catch (error) {
      console.error('Registration error:', error);
      
      // Better error messages
      switch (error.code) {
        case 'auth/email-already-in-use':
          setError('This email is already registered. Please use a different email or try logging in.');
          break;
        case 'auth/weak-password':
          setError('Password is too weak. Please choose a stronger password.');
          break;
        case 'auth/invalid-email':
          setError('Please enter a valid email address.');
          break;
        default:
          setError(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const passwordValidation = validatePassword(formData.password);

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

      {/* Glass container - Expanded height for password requirements */}
      <div className="relative z-10 w-11/12 md:w-4/5 max-w-6xl bg-white/10 backdrop-blur-lg rounded-xl shadow-2xl flex flex-col md:flex-row overflow-hidden min-h-[60vh] border border-white/30">

       {/* Left Section with Light Gradient */}
        <div className="w-full md:w-1/2 hidden md:flex flex-col justify-center relative overflow-hidden p-8">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-200 via-purple-200 to-pink-200"></div>
          <div className="absolute inset-0 bg-gradient-to-tl from-indigo-100 via-transparent to-transparent opacity-60"></div>
          
          <div className="absolute inset-0">
            <div className="absolute top-1/4 left-1/4 w-32 h-32 border-2 border-white/50 rounded-full animate-pulse"></div>
            <div className="absolute bottom-1/4 right-1/4 w-24 h-24 bg-white/30 rounded-full animate-ping"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 border-4 border-white/40 rounded-full animate-spin-slow"></div>
            <div className="absolute top-16 right-16 w-16 h-16 bg-blue-300/40 rotate-45 animate-bounce"></div>
          </div>
          
          <div className="relative z-10 text-gray-800 text-center">
            <div>
              <h1 className="text-4xl font-bold mb-4 animate-fade-in">Welcome!</h1>
              <p className="text-xl opacity-80 animate-slide-up">Join our community today</p>
            </div>
          </div>
        </div>
        
        {/* Right Form Section - Transparent */}
        <div className="w-full md:w-1/2 p-8 text-gray-800 flex items-center min-h-full relative">
          <div className="w-full px-10 relative z-10">
            <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Create Account</h2>
            
            {error && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block mb-1 font-medium text-gray-700">Username</label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-lg bg-white backdrop-blur-sm text-gray-800 placeholder-gray-600 outline-none focus:ring-2 focus:ring-blue-400/50 focus:bg-white/30 transition-all duration-300 border border-white/40"
                  placeholder="Username"
                  required
                />
              </div>
              
              <div>
                <label className="block mb-1 font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-lg bg-white backdrop-blur-sm text-gray-800 placeholder-gray-600 outline-none focus:ring-2 focus:ring-blue-400/50 focus:bg-white/30 transition-all duration-300 border border-white/40"
                  placeholder="Enter your email"
                  required
                />
              </div>
              
              <div>
                <label className="block mb-1 font-medium text-gray-700">Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 rounded-lg bg-white backdrop-blur-sm text-gray-800 placeholder-gray-600 outline-none focus:ring-2 transition-all duration-300 border ${
                    formData.password && !passwordValidation.isValid 
                      ? 'border-red-400 focus:ring-red-400/50' 
                      : formData.password && passwordValidation.isValid
                      ? 'border-green-400 focus:ring-green-400/50'
                      : 'border-white/40 focus:ring-blue-400/50'
                  }`}
                  placeholder="Enter password"
                  required
                />
                
                {/* Password Requirements */}
                {showPasswordRequirements && (
                  <div className="mt-3 p-3 bg-white/20 backdrop-blur-sm rounded-lg border border-white/30">
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">Password Requirements:</h4>
                    <div className="space-y-1 text-xs">
                      <div className={`flex items-center space-x-2 ${passwordValidation.requirements.length ? 'text-green-600' : 'text-red-600'}`}>
                        <span>{passwordValidation.requirements.length ? '✓' : '✗'}</span>
                        <span>At least 8 characters long</span>
                      </div>
                      <div className={`flex items-center space-x-2 ${passwordValidation.requirements.uppercase ? 'text-green-600' : 'text-red-600'}`}>
                        <span>{passwordValidation.requirements.uppercase ? '✓' : '✗'}</span>
                        <span>At least one uppercase letter (A-Z)</span>
                      </div>
                      <div className={`flex items-center space-x-2 ${passwordValidation.requirements.lowercase ? 'text-green-600' : 'text-red-600'}`}>
                        <span>{passwordValidation.requirements.lowercase ? '✓' : '✗'}</span>
                        <span>At least one lowercase letter (a-z)</span>
                      </div>
                      <div className={`flex items-center space-x-2 ${passwordValidation.requirements.number ? 'text-green-600' : 'text-red-600'}`}>
                        <span>{passwordValidation.requirements.number ? '✓' : '✗'}</span>
                        <span>At least one number (0-9)</span>
                      </div>
                      <div className={`flex items-center space-x-2 ${passwordValidation.requirements.special ? 'text-green-600' : 'text-red-600'}`}>
                        <span>{passwordValidation.requirements.special ? '✓' : '✗'}</span>
                        <span>At least one special character (!@#$%^&*)</span>
                      </div>
                    </div>
                    
                    {/* Password strength indicator */}
                    <div className="mt-3">
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-medium text-gray-700">Strength:</span>
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full transition-all duration-300 ${
                              Object.values(passwordValidation.requirements).filter(Boolean).length <= 2
                                ? 'bg-red-500 w-1/4'
                                : Object.values(passwordValidation.requirements).filter(Boolean).length <= 4
                                ? 'bg-yellow-500 w-3/4'
                                : 'bg-green-500 w-full'
                            }`}
                          ></div>
                        </div>
                        <span className={`text-xs font-medium ${
                          Object.values(passwordValidation.requirements).filter(Boolean).length <= 2
                            ? 'text-red-600'
                            : Object.values(passwordValidation.requirements).filter(Boolean).length <= 4
                            ? 'text-yellow-600'
                            : 'text-green-600'
                        }`}>
                          {Object.values(passwordValidation.requirements).filter(Boolean).length <= 2
                            ? 'Weak'
                            : Object.values(passwordValidation.requirements).filter(Boolean).length <= 4
                            ? 'Medium'
                            : 'Strong'
                          }
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              <button
                type="submit"
                disabled={loading || (formData.password && !passwordValidation.isValid)}
                className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {loading ? 'Creating Account...' : 'Register'}
              </button>
              
              <div className="w-full flex items-center justify-center mt-6">
                <p className="text-sm text-gray-600">
                  Already have an account?{" "}
                  <a
                    href="/login"
                    className="font-medium text-indigo-600 hover:underline focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    Sign in
                  </a>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>

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

export default Register;