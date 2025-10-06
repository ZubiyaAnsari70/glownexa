# Firebase Setup & Authentication Guide

This guide explains how Firebase authentication and Firestore database are configured and implemented in the Glownexa application.

## 🔧 Firebase Project Setup

### 1. Firebase Console Configuration

1. **Create Firebase Project**
   ```
   1. Go to https://console.firebase.google.com/
   2. Click "Create a project"
   3. Enter project name: "glownexa"
   4. Enable Google Analytics (optional)
   5. Complete project creation
   ```

2. **Enable Authentication**
   ```
   1. Navigate to Authentication → Sign-in method
   2. Enable Email/Password provider
   3. Configure authorized domains
   4. Set up email templates (optional)
   ```

3. **Create Firestore Database**
   ```
   1. Go to Firestore Database
   2. Click "Create database"
   3. Choose "Start in test mode" initially
   4. Select database location (multi-region)
   5. Create database
   ```

### 2. Firebase Configuration File

**Location**: `src/Components/firebase.js`

```javascript
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAixsI1SMdzQ4BWasEtZvcPzlhLR7LeruA",
  authDomain: "glownexa-e6928.firebaseapp.com",
  projectId: "glownexa-e6928",
  storageBucket: "glownexa-e6928.firebasestorage.app",
  messagingSenderId: "264005303598",
  appId: "1:264005303598:web:bca5bd9a02b3f35ceed54a"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

export default app;
```

## 🔐 Authentication System

### 1. User Registration Process

**Component**: `src/Components/register.js`

#### Registration Flow:
```javascript
const registerUser = async (email, password, confirmPassword) => {
  try {
    // 1. Validate password match
    if (password !== confirmPassword) {
      throw new Error("Passwords don't match");
    }

    // 2. Create user account
    const userCredential = await createUserWithEmailAndPassword(
      auth, 
      email, 
      password
    );

    // 3. Send email verification
    await sendEmailVerification(userCredential.user);

    // 4. Show success message
    setMessage({
      text: "Registration successful! Please check your email for verification.",
      type: "success"
    });

    // 5. Redirect to login
    setTimeout(() => {
      navigate('/login');
    }, 3000);

  } catch (error) {
    setMessage({
      text: error.message,
      type: "error"
    });
  }
};
```

#### Key Features:
- **Email/Password Creation**: Using Firebase Auth
- **Email Verification**: Automatic verification email
- **Error Handling**: User-friendly error messages
- **Input Validation**: Form validation and security

### 2. User Login Process

**Component**: `src/Components/Login.js`

#### Login Flow:
```javascript
const loginUser = async (email, password) => {
  try {
    // 1. Sign in with credentials
    const userCredential = await signInWithEmailAndPassword(
      auth, 
      email, 
      password
    );

    // 2. Check email verification
    if (!userCredential.user.emailVerified) {
      setMessage({
        text: "Please verify your email before logging in.",
        type: "warning"
      });
      return;
    }

    // 3. Successful login
    setMessage({
      text: "Login successful! Redirecting...",
      type: "success"
    });

    // 4. Redirect to home
    setTimeout(() => {
      navigate('/');
    }, 1500);

  } catch (error) {
    setMessage({
      text: "Invalid email or password. Please try again.",
      type: "error"
    });
  }
};
```

### 3. Protected Routes

**Component**: `src/Components/ProtectedRoute.js`

```javascript
import React, { useState, useEffect } from 'react';
import { auth } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';

const ProtectedRoute = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!user.emailVerified) {
    return <Navigate to="/verify" replace />;
  }

  return children;
};
```

## 📧 Email Verification

**Component**: `src/Components/verify.js`

### Verification Process:
```javascript
const handleEmailVerification = async () => {
  try {
    // 1. Get current user
    const user = auth.currentUser;
    
    if (user) {
      // 2. Send verification email
      await sendEmailVerification(user);
      
      setMessage({
        text: "Verification email sent! Please check your inbox.",
        type: "success"
      });
    }
  } catch (error) {
    setMessage({
      text: "Error sending verification email. Please try again.",
      type: "error"
    });
  }
};

const checkVerificationStatus = async () => {
  try {
    // 1. Reload user data
    await auth.currentUser.reload();
    
    // 2. Check verification status
    if (auth.currentUser.emailVerified) {
      setMessage({
        text: "Email verified successfully! Redirecting...",
        type: "success"
      });
      
      // 3. Redirect to home
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } else {
      setMessage({
        text: "Email not verified yet. Please check your inbox.",
        type: "warning"
      });
    }
  } catch (error) {
    setMessage({
      text: "Error checking verification status.",
      type: "error"
    });
  }
};
```

## 🔄 Authentication State Management

### Global Auth State:
```javascript
// In components that need auth state
const [currentUser, setCurrentUser] = useState(null);

useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, (user) => {
    setCurrentUser(user);
  });

  return () => unsubscribe();
}, []);
```

### User Data Access:
```javascript
// Get current user ID for database operations
const userId = auth.currentUser?.uid;

// Check if user is authenticated
const isAuthenticated = !!auth.currentUser;

// Get user email
const userEmail = auth.currentUser?.email;
```

## 🚪 Logout Functionality

```javascript
const handleLogout = async () => {
  try {
    await signOut(auth);
    navigate('/login');
  } catch (error) {
    console.error('Error signing out:', error);
  }
};
```

## 🔒 Security Features

### 1. Input Validation
- Email format validation
- Password strength requirements
- Confirm password matching

### 2. Error Handling
- User-friendly error messages
- Network error handling
- Authentication state errors

### 3. Route Protection
- Authenticated routes only
- Email verification requirements
- Automatic redirects

## 📱 User Experience Features

### 1. Loading States
```javascript
const [loading, setLoading] = useState(false);

// Show loading during auth operations
if (loading) {
  return <LoadingSpinner />;
}
```

### 2. Success/Error Messages
```javascript
const [message, setMessage] = useState({ text: '', type: '' });

// Display user feedback
{message.text && (
  <div className={`message ${message.type}`}>
    {message.text}
  </div>
)}
```

### 3. Form Validation
```javascript
const validateForm = () => {
  if (!email || !password) {
    setMessage({
      text: "Please fill in all fields",
      type: "error"
    });
    return false;
  }
  return true;
};
```

## 🔧 Troubleshooting

### Common Issues:

1. **"Firebase: Error (auth/invalid-email)"**
   - Solution: Validate email format before submission

2. **"Firebase: Error (auth/weak-password)"**
   - Solution: Enforce password requirements (min 6 characters)

3. **"Firebase: Error (auth/email-already-in-use)"**
   - Solution: Check if user exists, offer login option

4. **"Firebase: Error (auth/user-not-found)"**
   - Solution: Verify email exists, offer registration

### Debug Tips:
```javascript
// Enable Firebase Auth debug mode (development only)
import { connectAuthEmulator } from 'firebase/auth';

if (process.env.NODE_ENV === 'development') {
  connectAuthEmulator(auth, 'http://localhost:9099');
}
```

## 📊 Authentication Metrics

### Track Important Events:
- User registrations
- Login attempts
- Email verification rates
- Authentication errors

### Monitor Performance:
- Login success rate
- Time to authentication
- Error frequency
- User retention

---

**Next**: [Cloudinary Integration Guide](./cloudinary-integration.md)
