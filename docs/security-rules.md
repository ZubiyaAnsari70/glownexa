# Security & Firestore Rules Guide

This comprehensive guide covers the security implementation for the Glownexa application, including Firestore security rules, authentication protection, and data privacy measures.

## 🔐 Firestore Security Rules Overview

Firestore Security Rules provide server-side security for your Firebase app, controlling access to documents and collections. For Glownexa, we implement user-based data isolation and operation restrictions.

### 1. Security Rules Philosophy

**Core Principles**:
- **User Data Isolation**: Users can only access their own analysis data
- **Authenticated Access Only**: All operations require valid authentication
- **Read/Write Restrictions**: Users can create and read their own data, but cannot modify others' data
- **Field-Level Validation**: Ensure data integrity through structure validation
- **Quota Protection**: Prevent abuse through rate limiting concepts

### 2. Current Firestore Rules Implementation

**Location**: Firebase Console → Firestore Database → Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Main collection for skin and hair analyses
    match /skinAnalyses/{analysisId} {
      // Allow read and write only if the user is authenticated 
      // and the document belongs to them
      allow read, write: if request.auth != null 
        && request.auth.uid == resource.data.userId;
      
      // Allow create only if the user is authenticated 
      // and they're creating a document with their own userId
      allow create: if request.auth != null 
        && request.auth.uid == request.resource.data.userId
        && isValidAnalysisData(request.resource.data);
      
      // Allow update only if the user owns the document
      // and maintains data integrity
      allow update: if request.auth != null 
        && request.auth.uid == resource.data.userId
        && request.auth.uid == request.resource.data.userId
        && isValidUpdateData(request.resource.data, resource.data);
      
      // Allow delete only if the user owns the document
      allow delete: if request.auth != null 
        && request.auth.uid == resource.data.userId;
    }

    // Future: User profiles collection
    match /users/{userId} {
      allow read, write: if request.auth != null 
        && request.auth.uid == userId;
    }
    
    // Deny access to all other documents
    match /{document=**} {
      allow read, write: if false;
    }
  }

  // Helper function to validate analysis data structure
  function isValidAnalysisData(data) {
    return data.keys().hasAll([
      'userId', 'analysisType', 'age', 'gender', 
      'cloudinaryUrl', 'aiAnalysis', 'createdAt'
    ]) &&
    data.userId is string &&
    data.analysisType in ['skin', 'hair'] &&
    data.age is number &&
    data.age >= 13 && data.age <= 100 &&
    data.gender in ['male', 'female', 'other'] &&
    data.cloudinaryUrl is string &&
    data.aiAnalysis is string &&
    data.createdAt is timestamp &&
    
    // Conditional validation based on analysis type
    (data.analysisType == 'skin' ? 
      data.keys().hasAll(['skinType']) && data.skinType is string :
      data.keys().hasAll(['hairType']) && data.hairType is string
    );
  }

  // Helper function to validate update operations
  function isValidUpdateData(newData, oldData) {
    return 
      // Core fields cannot be changed
      newData.userId == oldData.userId &&
      newData.analysisType == oldData.analysisType &&
      newData.createdAt == oldData.createdAt &&
      
      // Only allow updating specific fields
      newData.diff(oldData).affectedKeys().hasOnly([
        'aiAnalysis', 'updatedAt', 'cloudinaryUrl', 
        'cloudinaryPublicId', 'originalFileName'
      ]) &&
      
      // Ensure updatedAt is current
      newData.updatedAt is timestamp;
  }
}
```

## 🛡️ Security Rules Deployment

### 1. Using Firebase CLI

**Prerequisites**:
```bash
# Install Firebase CLI
npm install -g firebase-cli

# Login to Firebase
firebase login

# Initialize project (if not done)
firebase init
```

**Deploy Security Rules**:
```bash
# Navigate to project directory
cd C:\Users\ojhap\Desktop\glownexa\glownexa

# Create firebase.json if not exists
# (This should already exist from project setup)

# Deploy only Firestore rules
firebase deploy --only firestore:rules

# Deploy all Firebase features (if needed)
firebase deploy
```

### 2. Firebase Console Method

1. **Open Firebase Console**: https://console.firebase.google.com
2. **Select Project**: Choose your Glownexa project
3. **Navigate to Firestore**: Firestore Database → Rules
4. **Edit Rules**: Copy and paste the security rules
5. **Publish**: Click "Publish" to deploy changes

### 3. Rules Testing

**Firebase Console Simulator**:
```javascript
// Test authenticated user reading their own data
// Authenticated as: user123@example.com (uid: user123)
// Path: /skinAnalyses/doc123
// Document data: { userId: "user123", analysisType: "skin", ... }
// Operation: read
// Result: ✅ Allow

// Test user trying to read another user's data
// Authenticated as: user123@example.com (uid: user123)
// Path: /skinAnalyses/doc456
// Document data: { userId: "user456", analysisType: "hair", ... }
// Operation: read
// Result: ❌ Deny

// Test unauthenticated access
// Authenticated as: (none)
// Path: /skinAnalyses/doc123
// Operation: read
// Result: ❌ Deny
```

## 🔒 Authentication Security Implementation

### 1. Protected Routes

**File**: `src/Components/ProtectedRoute.js`

```javascript
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';

const ProtectedRoute = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        // Additional checks for email verification
        if (!currentUser.emailVerified) {
          navigate('/verify');
          return;
        }
        setUser(currentUser);
      } else {
        navigate('/login');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [navigate]);

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Verifying authentication...</p>
        </div>
      </div>
    );
  }

  // Only render children if user is authenticated and verified
  return user ? children : null;
};

export default ProtectedRoute;
```

### 2. Authentication State Management

**Implementation across components**:

```javascript
// Pattern used in all protected components
const [user, setUser] = useState(null);
const [loading, setLoading] = useState(true);
const navigate = useNavigate();

useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
    if (currentUser && currentUser.emailVerified) {
      setUser(currentUser);
      // Component-specific logic here
    } else {
      navigate('/login');
    }
    setLoading(false);
  });

  return () => unsubscribe();
}, [navigate]);
```

### 3. Session Security

**Automatic Session Management**:
```javascript
// Firebase automatically handles:
// - Token refresh
// - Session expiration
// - Cross-tab synchronization
// - Secure token storage

// Additional security measures
export const enhanceSessionSecurity = () => {
  // Monitor authentication state changes
  onAuthStateChanged(auth, (user) => {
    if (user) {
      console.log('User authenticated:', user.uid);
      
      // Verify token periodically
      user.getIdTokenResult().then((idTokenResult) => {
        const authTime = new Date(idTokenResult.authTime);
        const now = new Date();
        const hoursSinceAuth = (now - authTime) / (1000 * 60 * 60);
        
        // Force re-authentication after 24 hours
        if (hoursSinceAuth > 24) {
          console.log('Forcing re-authentication due to session age');
          auth.signOut();
        }
      });
    }
  });
};
```

## 🔐 Data Privacy and Encryption

### 1. Client-Side Data Handling

**Sensitive Data Management**:
```javascript
// Never store sensitive data in localStorage
// Use session storage for temporary data only
export const secureDataStorage = {
  
  // Store non-sensitive UI preferences
  setPreference(key, value) {
    try {
      localStorage.setItem(`glownexa_pref_${key}`, JSON.stringify(value));
    } catch (error) {
      console.error('Failed to store preference:', error);
    }
  },

  getPreference(key, defaultValue = null) {
    try {
      const item = localStorage.getItem(`glownexa_pref_${key}`);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error('Failed to retrieve preference:', error);
      return defaultValue;
    }
  },

  // Clear all stored data on logout
  clearAllData() {
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('glownexa_')) {
        localStorage.removeItem(key);
      }
    });
    sessionStorage.clear();
  }
};

// Usage in authentication flow
export const secureSignOut = async () => {
  try {
    await auth.signOut();
    secureDataStorage.clearAllData();
    console.log('User signed out securely');
  } catch (error) {
    console.error('Error during sign out:', error);
  }
};
```

### 2. Image Upload Security

**Cloudinary Security Configuration**:
```javascript
// Secure image upload with validation
export const secureImageUpload = async (file) => {
  // Client-side validation
  const validationResult = validateImageFile(file);
  if (!validationResult.isValid) {
    throw new Error(validationResult.error);
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', 'your_upload_preset'); // Configured with restrictions
  formData.append('folder', 'glownexa/user_uploads'); // Organized storage
  
  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error('Upload failed');
    }

    const data = await response.json();
    
    // Return only necessary data
    return {
      success: true,
      url: data.secure_url, // Always use HTTPS
      publicId: data.public_id,
      format: data.format,
      size: data.bytes
    };
  } catch (error) {
    console.error('Secure upload error:', error);
    return { success: false, error: error.message };
  }
};

const validateImageFile = (file) => {
  const maxSize = 10 * 1024 * 1024; // 10MB
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
  
  if (!file) {
    return { isValid: false, error: 'No file provided' };
  }
  
  if (file.size > maxSize) {
    return { isValid: false, error: 'File too large (max 10MB)' };
  }
  
  if (!allowedTypes.includes(file.type)) {
    return { isValid: false, error: 'Invalid file type' };
  }
  
  return { isValid: true };
};
```

## 🛡️ API Security

### 1. Gemini API Security

**Environment Variables Protection**:
```javascript
// Environment configuration
// File: .env.local (not committed to git)
REACT_APP_GEMINI_API_KEY=your_secure_api_key_here
REACT_APP_FIREBASE_API_KEY=your_firebase_api_key
// ... other environment variables

// Secure API client setup
const GEMINI_API_KEY = process.env.REACT_APP_GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
  throw new Error('Gemini API key not configured');
}

// Rate limiting and quota management
class APIQuotaManager {
  constructor() {
    this.dailyQuota = 1500; // Adjust based on your limits
    this.requestCount = 0;
    this.lastResetDate = new Date().toDateString();
  }

  checkQuota() {
    const today = new Date().toDateString();
    
    // Reset counter daily
    if (today !== this.lastResetDate) {
      this.requestCount = 0;
      this.lastResetDate = today;
    }

    if (this.requestCount >= this.dailyQuota) {
      throw new Error('Daily API quota exceeded');
    }

    this.requestCount++;
    return true;
  }

  getRemainingQuota() {
    return Math.max(0, this.dailyQuota - this.requestCount);
  }
}

const quotaManager = new APIQuotaManager();

// Secure API request function
export const secureGeminiRequest = async (prompt, imageData) => {
  try {
    // Check quota before making request
    quotaManager.checkQuota();

    // Validate inputs
    if (!prompt || !imageData) {
      throw new Error('Invalid request parameters');
    }

    // Make API request with error handling
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GEMINI_API_KEY}`, // If required
      },
      body: JSON.stringify({
        contents: [{
          parts: [
            { text: prompt },
            { 
              inline_data: {
                mime_type: "image/jpeg",
                data: imageData
              }
            }
          ]
        }]
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error:', response.status, errorText);
      
      // Handle specific error codes
      switch (response.status) {
        case 429:
          throw new Error('API rate limit exceeded. Please try again later.');
        case 401:
          throw new Error('API authentication failed.');
        case 403:
          throw new Error('API access forbidden.');
        default:
          throw new Error('AI analysis service temporarily unavailable.');
      }
    }

    const data = await response.json();
    return { success: true, data };

  } catch (error) {
    console.error('Secure API request failed:', error);
    return { success: false, error: error.message };
  }
};
```

### 2. Input Sanitization

**AI Prompt Security**:
```javascript
// Sanitize user inputs for AI prompts
export const sanitizePromptInput = (input) => {
  if (!input || typeof input !== 'string') {
    return '';
  }

  return input
    // Remove potentially dangerous patterns
    .replace(/[<>'"&]/g, '') // Remove HTML/script injection characters
    .replace(/javascript:/gi, '') // Remove javascript: protocols
    .replace(/data:/gi, '') // Remove data: protocols
    .replace(/vbscript:/gi, '') // Remove vbscript: protocols
    
    // Limit length
    .substring(0, 1000)
    
    // Normalize whitespace
    .replace(/\s+/g, ' ')
    .trim();
};

// Validate age input
export const validateAge = (age) => {
  const numAge = parseInt(age, 10);
  
  if (isNaN(numAge) || numAge < 13 || numAge > 100) {
    throw new Error('Please enter a valid age between 13 and 100');
  }
  
  return numAge;
};

// Validate gender input
export const validateGender = (gender) => {
  const validGenders = ['male', 'female', 'other'];
  
  if (!validGenders.includes(gender.toLowerCase())) {
    throw new Error('Please select a valid gender option');
  }
  
  return gender.toLowerCase();
};
```

## 🔍 Security Monitoring

### 1. Error Logging and Monitoring

**Security Event Logging**:
```javascript
// Security event logger
class SecurityLogger {
  static logAuthEvent(event, userId = null, details = {}) {
    const logData = {
      timestamp: new Date().toISOString(),
      event: event,
      userId: userId,
      userAgent: navigator.userAgent,
      url: window.location.href,
      details: details
    };

    console.log('Security Event:', logData);
    
    // In production, send to monitoring service
    // this.sendToMonitoringService(logData);
  }

  static logDataAccess(operation, collection, documentId, userId) {
    this.logAuthEvent('data_access', userId, {
      operation: operation,
      collection: collection,
      documentId: documentId
    });
  }

  static logFailedAuth(email, reason) {
    this.logAuthEvent('auth_failed', null, {
      email: email,
      reason: reason,
      ip: 'client-side' // Would need server-side for real IP
    });
  }
}

// Usage in authentication components
export const secureSignIn = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    
    SecurityLogger.logAuthEvent('sign_in_success', userCredential.user.uid);
    
    return { success: true, user: userCredential.user };
  } catch (error) {
    SecurityLogger.logFailedAuth(email, error.code);
    
    return { success: false, error: error.message };
  }
};
```

### 2. Suspicious Activity Detection

**Client-Side Security Checks**:
```javascript
// Basic suspicious activity detection
class SecurityMonitor {
  constructor() {
    this.failedAttempts = new Map();
    this.rapidRequests = new Map();
  }

  // Track failed authentication attempts
  recordFailedAuth(identifier) {
    const current = this.failedAttempts.get(identifier) || 0;
    this.failedAttempts.set(identifier, current + 1);

    // Lock out after 5 failed attempts
    if (current + 1 >= 5) {
      SecurityLogger.logAuthEvent('potential_brute_force', null, {
        identifier: identifier,
        attempts: current + 1
      });
      
      throw new Error('Too many failed attempts. Please try again later.');
    }
  }

  // Clear failed attempts on successful auth
  clearFailedAttempts(identifier) {
    this.failedAttempts.delete(identifier);
  }

  // Rate limiting for API requests
  checkRequestRate(userId) {
    const now = Date.now();
    const userRequests = this.rapidRequests.get(userId) || [];
    
    // Remove requests older than 1 minute
    const recentRequests = userRequests.filter(time => now - time < 60000);
    
    // Allow max 10 requests per minute
    if (recentRequests.length >= 10) {
      SecurityLogger.logAuthEvent('rate_limit_exceeded', userId);
      throw new Error('Too many requests. Please slow down.');
    }

    recentRequests.push(now);
    this.rapidRequests.set(userId, recentRequests);
  }
}

const securityMonitor = new SecurityMonitor();

// Enhanced authentication with security monitoring
export const monitoredSignIn = async (email, password) => {
  try {
    const result = await secureSignIn(email, password);
    
    if (result.success) {
      securityMonitor.clearFailedAttempts(email);
    } else {
      securityMonitor.recordFailedAuth(email);
    }
    
    return result;
  } catch (error) {
    securityMonitor.recordFailedAuth(email);
    throw error;
  }
};
```

## 🔧 Security Best Practices

### 1. Development Security Checklist

**✅ Authentication Security**:
- [x] Email verification required
- [x] Protected routes implementation
- [x] Session management
- [x] Secure sign out

**✅ Data Security**:
- [x] User data isolation in Firestore rules
- [x] Input validation and sanitization
- [x] No sensitive data in localStorage
- [x] HTTPS-only image URLs

**✅ API Security**:
- [x] Environment variables for API keys
- [x] Rate limiting and quota management
- [x] Error handling without data leakage
- [x] Input sanitization for AI prompts

**✅ Client Security**:
- [x] Content Security Policy headers (configure in hosting)
- [x] Secure image upload validation
- [x] Error logging and monitoring
- [x] Suspicious activity detection

### 2. Production Security Configuration

**Firebase Hosting Security Headers**:
```json
// firebase.json
{
  "hosting": {
    "public": "build",
    "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ],
    "headers": [
      {
        "source": "**",
        "headers": [
          {
            "key": "X-Content-Type-Options",
            "value": "nosniff"
          },
          {
            "key": "X-Frame-Options",
            "value": "DENY"
          },
          {
            "key": "X-XSS-Protection",
            "value": "1; mode=block"
          },
          {
            "key": "Strict-Transport-Security",
            "value": "max-age=31536000; includeSubDomains"
          },
          {
            "key": "Content-Security-Policy",
            "value": "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https://res.cloudinary.com; connect-src 'self' https://*.googleapis.com https://api.cloudinary.com"
          }
        ]
      }
    ]
  }
}
```

**Environment Variables Security**:
```bash
# Production environment setup
# Never commit .env files to version control

# .env.production
REACT_APP_FIREBASE_API_KEY=your_production_firebase_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your-project-id
REACT_APP_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
REACT_APP_GEMINI_API_KEY=your_production_gemini_key
REACT_APP_CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud
```

### 3. Security Maintenance

**Regular Security Tasks**:
```javascript
// Security maintenance checklist
export const securityMaintenance = {
  daily: [
    'Monitor authentication logs',
    'Check API quota usage',
    'Review failed request patterns'
  ],
  
  weekly: [
    'Audit user access patterns',
    'Review Firestore security rules',
    'Check for suspicious data access',
    'Update dependencies for security patches'
  ],
  
  monthly: [
    'Rotate API keys if possible',
    'Review and update security headers',
    'Audit user data retention',
    'Security penetration testing'
  ],
  
  quarterly: [
    'Complete security audit',
    'Review and update security policies',
    'Staff security training',
    'Disaster recovery testing'
  ]
};
```

---

**Next**: [Deployment Guide](./deployment.md)
