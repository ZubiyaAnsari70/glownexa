import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { applyActionCode, sendEmailVerification, onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';

const EmailVerificationHandler = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('checking'); // checking, waiting, verifying, success, error
  const [message, setMessage] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const [sendingEmail, setSendingEmail] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      if (!user) {
        // If no user is logged in, redirect to login
        navigate('/login');
        return;
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  useEffect(() => {
    const handleEmailVerification = async () => {
      const actionCode = searchParams.get('oobCode');
      const mode = searchParams.get('mode');

      if (mode === 'verifyEmail' && actionCode) {
        setStatus('verifying');
        setMessage('Verifying your email...');
        
        try {
          await applyActionCode(auth, actionCode);
          setStatus('success');
          setMessage('Your email has been verified successfully!');
          
          // Redirect to login after 3 seconds
          setTimeout(() => {
            navigate('/login');
          }, 3000);
          
        } catch (error) {
          console.error('Email verification error:', error);
          setStatus('error');
          setMessage('Failed to verify email. The link may be expired or invalid.');
        }
      } else {
        // No verification parameters - show waiting screen
        setStatus('waiting');
        setMessage('We\'ve sent a verification email to your inbox.');
      }
    };

    if (currentUser) {
      handleEmailVerification();
    }
  }, [searchParams, navigate, currentUser]);

  const handleResendEmail = async () => {
    if (!currentUser) {
      setMessage('Please log in to resend verification email.');
      return;
    }

    setSendingEmail(true);
    
    try {
      const actionCodeSettings = {
        url: 'https://glownexa.vercel.app/verify',
        handleCodeInApp: false,
      };

      await sendEmailVerification(currentUser, actionCodeSettings);
      setMessage('Verification email sent successfully! Please check your inbox.');
      
    } catch (error) {
      console.error('Error sending verification email:', error);
      setMessage('Failed to send verification email. Please try again.');
    } finally {
      setSendingEmail(false);
    }
  };

  return (
    <div className="h-screen relative overflow-hidden flex items-center justify-center">
      {/* Background similar to your register page */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-100 via-purple-50 to-pink-100"></div>
      
      {/* Floating Animated Objects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 left-10 w-64 h-64 bg-blue-200 bg-opacity-20 rounded-full blur-xl animate-float"></div>
        <div className="absolute top-32 right-20 w-80 h-80 bg-purple-200 bg-opacity-15 rounded-full blur-2xl animate-float-delayed"></div>
        <div className="absolute bottom-20 left-1/4 w-72 h-72 bg-pink-200 bg-opacity-20 rounded-full blur-xl animate-pulse-slow"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 w-11/12 md:w-4/5 max-w-2xl bg-white/10 backdrop-blur-lg rounded-xl shadow-2xl border border-white/30 p-8">
        <div className="text-center">
          {status === 'checking' && (
            <>
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Loading...</h2>
              <p className="text-gray-600">Please wait...</p>
            </>
          )}

          {status === 'waiting' && (
            <>
              <div className="text-blue-500 text-8xl mb-6">📧</div>
              <h2 className="text-3xl font-bold text-gray-800 mb-4">Check Your Inbox</h2>
              <p className="text-lg text-gray-600 mb-6">{message}</p>
              <p className="text-gray-500 mb-8 leading-relaxed">
                We've sent a verification link to your email address. 
                <br />
                Please check your email and click on the verification link to continue.
              </p>
              
              {/* Action Buttons */}
              <div className="space-y-4">
                <button
                  onClick={handleResendEmail}
                  disabled={sendingEmail}
                  className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {sendingEmail ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Sending Email...
                    </div>
                  ) : (
                    'Send Email Again'
                  )}
                </button>
                
                <button
                  onClick={() => navigate('/login')}
                  className="w-full py-3 bg-gray-500 hover:bg-gray-600 text-white font-bold rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  Back to Login
                </button>
              </div>
              
              {/* Additional Info */}
              <div className="mt-8 p-4 bg-white/20 backdrop-blur-sm rounded-lg border border-white/30">
                <p className="text-sm text-gray-600">
                  <strong>Didn't receive the email?</strong>
                  <br />
                  • Check your spam/junk folder
                  <br />
                  • Make sure you entered the correct email address
                  <br />
                  • Click "Send Email Again" to resend
                </p>
              </div>
            </>
          )}
          
          {status === 'verifying' && (
            <>
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Verifying Email</h2>
              <p className="text-gray-600">{message}</p>
            </>
          )}
          
          {status === 'success' && (
            <>
              <div className="text-green-500 text-8xl mb-6">✓</div>
              <h2 className="text-3xl font-bold text-gray-800 mb-4">Email Verified!</h2>
              <p className="text-lg text-gray-600 mb-4">{message}</p>
              <p className="text-gray-500">Redirecting to login page in 3 seconds...</p>
              
              <button
                onClick={() => navigate('/login')}
                className="mt-4 py-2 px-6 bg-green-500 hover:bg-green-600 text-white font-bold rounded-lg transition duration-300"
              >
                Continue to Login
              </button>
            </>
          )}
          
          {status === 'error' && (
            <>
              <div className="text-red-500 text-8xl mb-6">✗</div>
              <h2 className="text-3xl font-bold text-gray-800 mb-4">Verification Failed</h2>
              <p className="text-lg text-gray-600 mb-6">{message}</p>
              
              <div className="space-y-4">
                <button
                  onClick={handleResendEmail}
                  disabled={sendingEmail}
                  className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300 disabled:opacity-50"
                >
                  {sendingEmail ? 'Sending...' : 'Send New Verification Email'}
                </button>
                
                <button
                  onClick={() => navigate('/login')}
                  className="w-full py-3 bg-gray-500 hover:bg-gray-600 text-white font-bold rounded-lg transition duration-300"
                >
                  Back to Login
                </button>
              </div>
            </>
          )}
        </div>
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

        @keyframes pulse-slow {
          0%, 100% { opacity: 0.1; transform: scale(1); }
          50% { opacity: 0.3; transform: scale(1.1); }
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }

        .animate-float-delayed {
          animation: float-delayed 8s ease-in-out infinite 2s;
        }

        .animate-pulse-slow {
          animation: pulse-slow 4s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default EmailVerificationHandler;