# Data Management & Firestore Guide

This comprehensive guide explains how data is managed, stored, and retrieved using Firebase Firestore for the Glownexa application, including user data isolation, analysis history, and data security.

## 🗄️ Database Architecture

### 1. Firestore Database Structure

```
glownexa-firestore/
├── skinAnalyses/          # Main collection for all analyses
│   ├── {documentId}/      # Auto-generated document IDs
│   │   ├── userId         # User identifier
│   │   ├── analysisType   # 'skin' or 'hair'
│   │   ├── age           # User age range
│   │   ├── gender        # User gender
│   │   ├── skinType      # For skin analysis
│   │   ├── hairType      # For hair analysis
│   │   ├── cloudinaryUrl # Image URL
│   │   ├── aiAnalysis    # AI-generated analysis
│   │   ├── createdAt     # Timestamp
│   │   └── updatedAt     # Timestamp
│   └── ...
└── users/                 # Future: User profiles (optional)
    ├── {userId}/
    │   ├── email
    │   ├── preferences
    │   └── metadata
    └── ...
```

### 2. Data Model Design

**Unified Collection Approach**: Both skin and hair analyses are stored in the same `skinAnalyses` collection, differentiated by the `analysisType` field. This approach:
- Simplifies querying user's complete history
- Maintains consistent data structure
- Enables efficient filtering and sorting
- Reduces database complexity

## 🔧 Firestore Service Implementation

**File**: `src/Components/firestoreService.js`

### 1. Database Configuration

```javascript
// Firestore service for saving analysis data
import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  doc, 
  updateDoc,
  orderBy,
  limit
} from 'firebase/firestore';
import { db } from './firebase';
```

### 2. Core Database Operations

#### Save Skin Analysis

```javascript
export const saveSkinAnalysis = async (userId, analysisData) => {
  try {
    // Validate required fields
    if (!userId || !analysisData) {
      throw new Error('Missing required parameters');
    }

    const docRef = await addDoc(collection(db, 'skinAnalyses'), {
      userId: userId,
      analysisType: 'skin', // Type identifier
      age: analysisData.age,
      gender: analysisData.gender,
      skinType: analysisData.skinType,
      originalFileName: analysisData.originalFileName,
      cloudinaryUrl: analysisData.cloudinaryUrl,
      cloudinaryPublicId: analysisData.cloudinaryPublicId,
      aiAnalysis: analysisData.aiAnalysis,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    console.log('Skin analysis saved with ID: ', docRef.id);
    return { 
      success: true, 
      id: docRef.id,
      message: 'Skin analysis saved successfully'
    };
  } catch (error) {
    console.error('Error saving skin analysis: ', error);
    return { 
      success: false, 
      error: error.message,
      code: error.code
    };
  }
};
```

#### Save Hair Analysis

```javascript
export const saveHairAnalysis = async (userId, analysisData) => {
  try {
    // Validate required fields
    if (!userId || !analysisData) {
      throw new Error('Missing required parameters');
    }

    const docRef = await addDoc(collection(db, 'skinAnalyses'), {
      userId: userId,
      analysisType: 'hair', // Type identifier
      age: analysisData.age,
      gender: analysisData.gender,
      hairType: analysisData.hairType, // Different from skinType
      originalFileName: analysisData.originalFileName,
      cloudinaryUrl: analysisData.cloudinaryUrl,
      cloudinaryPublicId: analysisData.cloudinaryPublicId,
      aiAnalysis: analysisData.aiAnalysis,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    console.log('Hair analysis saved with ID: ', docRef.id);
    return { 
      success: true, 
      id: docRef.id,
      message: 'Hair analysis saved successfully'
    };
  } catch (error) {
    console.error('Error saving hair analysis: ', error);
    return { 
      success: false, 
      error: error.message,
      code: error.code
    };
  }
};
```

#### Retrieve User Analyses

```javascript
export const getUserSkinAnalyses = async (userId) => {
  try {
    // Validate user ID
    if (!userId) {
      throw new Error('User ID is required');
    }

    // Query for all analyses belonging to the user
    const q = query(
      collection(db, 'skinAnalyses'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc') // Most recent first
    );

    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      return { 
        success: true, 
        data: [],
        message: 'No analyses found for this user'
      };
    }

    const analyses = [];
    querySnapshot.forEach((doc) => {
      analyses.push({
        id: doc.id,
        ...doc.data(),
        // Convert Firestore Timestamps to JavaScript Dates
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate()
      });
    });

    console.log(`Retrieved ${analyses.length} analyses for user ${userId}`);
    return { 
      success: true, 
      data: analyses,
      count: analyses.length
    };
  } catch (error) {
    console.error('Error getting user analyses: ', error);
    return { 
      success: false, 
      error: error.message,
      code: error.code
    };
  }
};
```

#### Update Analysis

```javascript
export const updateSkinAnalysis = async (analysisId, updateData) => {
  try {
    // Validate parameters
    if (!analysisId || !updateData) {
      throw new Error('Analysis ID and update data are required');
    }

    const analysisRef = doc(db, 'skinAnalyses', analysisId);
    
    await updateDoc(analysisRef, {
      ...updateData,
      updatedAt: new Date()
    });

    console.log('Analysis updated successfully:', analysisId);
    return { 
      success: true,
      message: 'Analysis updated successfully'
    };
  } catch (error) {
    console.error('Error updating analysis: ', error);
    return { 
      success: false, 
      error: error.message,
      code: error.code
    };
  }
};
```

## 📊 Data Retrieval and Display

**Component**: `src/Components/History.js`

### 1. History Component Architecture

```javascript
const History = () => {
  // State management
  const [analyses, setAnalyses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedAnalysis, setSelectedAnalysis] = useState(null);
  
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        fetchUserAnalyses(currentUser.uid);
      } else {
        navigate('/login');
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      {/* Header */}
      {/* Analysis Grid */}
      {/* Detail Modal */}
    </div>
  );
};
```

### 2. Data Fetching Logic

```javascript
const fetchUserAnalyses = async (userId) => {
  try {
    setLoading(true);
    setError(null);

    console.log('Fetching analyses for user:', userId);
    
    const result = await getUserSkinAnalyses(userId);
    
    if (result.success) {
      setAnalyses(result.data);
      console.log(`Loaded ${result.data.length} analyses`);
    } else {
      setError(result.error);
      console.error('Failed to fetch analyses:', result.error);
    }
  } catch (error) {
    setError(error.message);
    console.error('Error in fetchUserAnalyses:', error);
  } finally {
    setLoading(false);
  }
};
```

### 3. Unified Display for Both Analysis Types

```javascript
const AnalysisCard = ({ analysis }) => {
  const isHairAnalysis = analysis.analysisType === 'hair';
  
  const cardColors = {
    skin: {
      gradient: 'from-purple-500 to-pink-500',
      background: 'bg-purple-50',
      border: 'border-purple-200',
      text: 'text-purple-800'
    },
    hair: {
      gradient: 'from-orange-500 to-yellow-500',
      background: 'bg-orange-50',
      border: 'border-orange-200',
      text: 'text-orange-800'
    }
  };

  const colors = cardColors[analysis.analysisType] || cardColors.skin;

  return (
    <div className={`${colors.background} rounded-xl shadow-lg p-6 border-2 ${colors.border} hover:shadow-xl transition-all duration-300 cursor-pointer`}>
      
      {/* Analysis Type Header */}
      <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium mb-4 bg-gradient-to-r ${colors.gradient} text-white`}>
        {isHairAnalysis ? '💇 Hair Analysis' : '🧴 Skin Analysis'}
      </div>

      {/* Analysis Details */}
      <div className="space-y-2">
        <p className={`text-sm ${colors.text}`}>
          <span className="font-semibold">Age:</span> {analysis.age}
        </p>
        <p className={`text-sm ${colors.text}`}>
          <span className="font-semibold">Gender:</span> {analysis.gender}
        </p>
        <p className={`text-sm ${colors.text}`}>
          <span className="font-semibold">
            {isHairAnalysis ? 'Hair Type:' : 'Skin Type:'}
          </span> {isHairAnalysis ? analysis.hairType : analysis.skinType}
        </p>
        <p className={`text-sm ${colors.text}`}>
          <span className="font-semibold">Date:</span> {analysis.createdAt?.toLocaleDateString()}
        </p>
      </div>

      {/* Image Preview */}
      {analysis.cloudinaryUrl && (
        <div className="mt-4">
          <img
            src={analysis.cloudinaryUrl}
            alt={`${analysis.analysisType} analysis`}
            className="w-full h-32 object-cover rounded-lg"
            loading="lazy"
          />
        </div>
      )}

      {/* Action Button */}
      <button
        onClick={() => setSelectedAnalysis(analysis)}
        className={`mt-4 w-full bg-gradient-to-r ${colors.gradient} text-white py-2 px-4 rounded-lg hover:opacity-90 transition-opacity`}
      >
        View Details
      </button>
    </div>
  );
};
```

## 🔍 Advanced Data Queries

### 1. Filtered Analysis Retrieval

```javascript
// Get analyses by type
export const getAnalysesByType = async (userId, analysisType) => {
  try {
    const q = query(
      collection(db, 'skinAnalyses'),
      where('userId', '==', userId),
      where('analysisType', '==', analysisType),
      orderBy('createdAt', 'desc')
    );

    const querySnapshot = await getDocs(q);
    const analyses = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate(),
      updatedAt: doc.data().updatedAt?.toDate()
    }));

    return { success: true, data: analyses };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Get recent analyses (last N)
export const getRecentAnalyses = async (userId, limitCount = 5) => {
  try {
    const q = query(
      collection(db, 'skinAnalyses'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    );

    const querySnapshot = await getDocs(q);
    const analyses = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate()
    }));

    return { success: true, data: analyses };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Get analyses by date range
export const getAnalysesByDateRange = async (userId, startDate, endDate) => {
  try {
    const q = query(
      collection(db, 'skinAnalyses'),
      where('userId', '==', userId),
      where('createdAt', '>=', startDate),
      where('createdAt', '<=', endDate),
      orderBy('createdAt', 'desc')
    );

    const querySnapshot = await getDocs(q);
    const analyses = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate()
    }));

    return { success: true, data: analyses };
  } catch (error) {
    return { success: false, error: error.message };
  }
};
```

### 2. Analytics and Statistics

```javascript
// Get user analysis statistics
export const getUserAnalyticsData = async (userId) => {
  try {
    const result = await getUserSkinAnalyses(userId);
    
    if (!result.success) {
      return result;
    }

    const analyses = result.data;
    
    const analytics = {
      totalAnalyses: analyses.length,
      skinAnalyses: analyses.filter(a => a.analysisType === 'skin').length,
      hairAnalyses: analyses.filter(a => a.analysisType === 'hair').length,
      firstAnalysisDate: analyses.length > 0 ? 
        Math.min(...analyses.map(a => a.createdAt?.getTime())) : null,
      lastAnalysisDate: analyses.length > 0 ? 
        Math.max(...analyses.map(a => a.createdAt?.getTime())) : null,
      analysisFrequency: calculateAnalysisFrequency(analyses),
      skinTypeDistribution: getSkinTypeDistribution(analyses),
      hairTypeDistribution: getHairTypeDistribution(analyses)
    };

    return { success: true, data: analytics };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

const calculateAnalysisFrequency = (analyses) => {
  if (analyses.length < 2) return null;
  
  const dates = analyses.map(a => a.createdAt).sort();
  const daysBetween = (dates[dates.length - 1] - dates[0]) / (1000 * 60 * 60 * 24);
  
  return {
    totalDays: Math.round(daysBetween),
    averageDaysBetween: Math.round(daysBetween / (analyses.length - 1))
  };
};

const getSkinTypeDistribution = (analyses) => {
  const skinAnalyses = analyses.filter(a => a.analysisType === 'skin');
  const distribution = {};
  
  skinAnalyses.forEach(analysis => {
    const type = analysis.skinType;
    distribution[type] = (distribution[type] || 0) + 1;
  });
  
  return distribution;
};

const getHairTypeDistribution = (analyses) => {
  const hairAnalyses = analyses.filter(a => a.analysisType === 'hair');
  const distribution = {};
  
  hairAnalyses.forEach(analysis => {
    const type = analysis.hairType;
    distribution[type] = (distribution[type] || 0) + 1;
  });
  
  return distribution;
};
```

## 💾 Data Backup and Export

### 1. Export User Data

```javascript
// Export all user data
export const exportUserData = async (userId) => {
  try {
    const result = await getUserSkinAnalyses(userId);
    
    if (!result.success) {
      return result;
    }

    const exportData = {
      userId: userId,
      exportDate: new Date().toISOString(),
      totalAnalyses: result.data.length,
      analyses: result.data.map(analysis => ({
        id: analysis.id,
        type: analysis.analysisType,
        date: analysis.createdAt?.toISOString(),
        details: {
          age: analysis.age,
          gender: analysis.gender,
          skinType: analysis.skinType,
          hairType: analysis.hairType,
          imageUrl: analysis.cloudinaryUrl,
          analysis: analysis.aiAnalysis
        }
      }))
    };

    return { success: true, data: exportData };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Download data as JSON file
export const downloadUserData = async (userId) => {
  try {
    const result = await exportUserData(userId);
    
    if (!result.success) {
      throw new Error(result.error);
    }

    const dataBlob = new Blob([JSON.stringify(result.data, null, 2)], {
      type: 'application/json'
    });

    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `glownexa-data-${userId}-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    return { success: true, message: 'Data exported successfully' };
  } catch (error) {
    return { success: false, error: error.message };
  }
};
```

## 🔧 Data Validation and Sanitization

### 1. Input Validation

```javascript
// Validate analysis data before saving
export const validateAnalysisData = (analysisData, analysisType) => {
  const errors = [];

  // Required fields
  if (!analysisData.age) errors.push('Age is required');
  if (!analysisData.gender) errors.push('Gender is required');
  if (!analysisData.aiAnalysis) errors.push('AI analysis is required');
  if (!analysisData.cloudinaryUrl) errors.push('Image URL is required');

  // Type-specific validation
  if (analysisType === 'skin') {
    if (!analysisData.skinType) errors.push('Skin type is required');
  } else if (analysisType === 'hair') {
    if (!analysisData.hairType) errors.push('Hair type is required');
  }

  // Data type validation
  if (analysisData.age && typeof analysisData.age !== 'number') {
    errors.push('Age must be a number');
  }

  // URL validation
  if (analysisData.cloudinaryUrl && !isValidUrl(analysisData.cloudinaryUrl)) {
    errors.push('Invalid image URL');
  }

  return {
    isValid: errors.length === 0,
    errors: errors
  };
};

const isValidUrl = (string) => {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
};
```

### 2. Data Sanitization

```javascript
// Sanitize user input data
export const sanitizeAnalysisData = (analysisData) => {
  const sanitized = { ...analysisData };

  // Trim string fields
  if (sanitized.gender) sanitized.gender = sanitized.gender.trim();
  if (sanitized.skinType) sanitized.skinType = sanitized.skinType.trim();
  if (sanitized.hairType) sanitized.hairType = sanitized.hairType.trim();
  if (sanitized.originalFileName) sanitized.originalFileName = sanitized.originalFileName.trim();

  // Sanitize AI analysis text
  if (sanitized.aiAnalysis) {
    sanitized.aiAnalysis = sanitized.aiAnalysis
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove scripts
      .trim();
  }

  // Ensure age is a number
  if (sanitized.age && typeof sanitized.age === 'string') {
    sanitized.age = parseInt(sanitized.age, 10);
  }

  return sanitized;
};
```

## 🔄 Real-time Data Updates

### 1. Firestore Real-time Listeners

```javascript
import { onSnapshot } from 'firebase/firestore';

// Listen for real-time updates to user analyses
export const subscribeToUserAnalyses = (userId, callback) => {
  const q = query(
    collection(db, 'skinAnalyses'),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  );

  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    const analyses = [];
    querySnapshot.forEach((doc) => {
      analyses.push({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate()
      });
    });

    callback({ success: true, data: analyses });
  }, (error) => {
    console.error('Error in real-time listener:', error);
    callback({ success: false, error: error.message });
  });

  return unsubscribe; // Return function to unsubscribe
};

// Usage in React component
const useRealTimeAnalyses = (userId) => {
  const [analyses, setAnalyses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;

    const unsubscribe = subscribeToUserAnalyses(userId, (result) => {
      if (result.success) {
        setAnalyses(result.data);
      } else {
        console.error('Real-time update error:', result.error);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [userId]);

  return { analyses, loading };
};
```

## 📊 Performance Optimization

### 1. Pagination for Large Datasets

```javascript
// Get paginated analyses
export const getPaginatedAnalyses = async (userId, lastDoc = null, pageSize = 10) => {
  try {
    let q = query(
      collection(db, 'skinAnalyses'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc'),
      limit(pageSize)
    );

    // If continuing from previous page
    if (lastDoc) {
      q = query(
        collection(db, 'skinAnalyses'),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc'),
        startAfter(lastDoc),
        limit(pageSize)
      );
    }

    const querySnapshot = await getDocs(q);
    
    const analyses = [];
    let lastDocument = null;

    querySnapshot.forEach((doc) => {
      analyses.push({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate()
      });
      lastDocument = doc;
    });

    return {
      success: true,
      data: analyses,
      lastDoc: lastDocument,
      hasMore: analyses.length === pageSize
    };
  } catch (error) {
    return { success: false, error: error.message };
  }
};
```

### 2. Caching Strategy

```javascript
// Simple in-memory cache for analyses
class AnalysisCache {
  constructor() {
    this.cache = new Map();
    this.cacheTimeout = 5 * 60 * 1000; // 5 minutes
  }

  set(userId, data) {
    this.cache.set(userId, {
      data: data,
      timestamp: Date.now()
    });
  }

  get(userId) {
    const cached = this.cache.get(userId);
    
    if (!cached) return null;
    
    // Check if cache is expired
    if (Date.now() - cached.timestamp > this.cacheTimeout) {
      this.cache.delete(userId);
      return null;
    }
    
    return cached.data;
  }

  clear(userId) {
    if (userId) {
      this.cache.delete(userId);
    } else {
      this.cache.clear();
    }
  }
}

const analysisCache = new AnalysisCache();

// Enhanced getUserSkinAnalyses with caching
export const getCachedUserAnalyses = async (userId, forceRefresh = false) => {
  // Try cache first unless force refresh
  if (!forceRefresh) {
    const cached = analysisCache.get(userId);
    if (cached) {
      console.log('Returning cached analyses');
      return { success: true, data: cached, fromCache: true };
    }
  }

  // Fetch from database
  const result = await getUserSkinAnalyses(userId);
  
  if (result.success) {
    analysisCache.set(userId, result.data);
  }
  
  return { ...result, fromCache: false };
};
```

## 🔧 Error Handling and Recovery

### 1. Comprehensive Error Handling

```javascript
// Enhanced error handling for database operations
export const handleDatabaseError = (error, operation) => {
  console.error(`Database error in ${operation}:`, error);

  // Categorize Firestore errors
  switch (error.code) {
    case 'permission-denied':
      return {
        success: false,
        error: 'Access denied. Please check your permissions.',
        code: 'PERMISSION_DENIED',
        userMessage: 'You don\'t have permission to perform this action.'
      };

    case 'unavailable':
      return {
        success: false,
        error: 'Database temporarily unavailable.',
        code: 'SERVICE_UNAVAILABLE',
        userMessage: 'Service is temporarily unavailable. Please try again.'
      };

    case 'deadline-exceeded':
      return {
        success: false,
        error: 'Request timeout.',
        code: 'TIMEOUT',
        userMessage: 'Request timed out. Please try again.'
      };

    case 'resource-exhausted':
      return {
        success: false,
        error: 'Quota exceeded.',
        code: 'QUOTA_EXCEEDED',
        userMessage: 'Service quota exceeded. Please try again later.'
      };

    default:
      return {
        success: false,
        error: error.message || 'Unknown database error',
        code: error.code || 'UNKNOWN_ERROR',
        userMessage: 'An unexpected error occurred. Please try again.'
      };
  }
};
```

### 2. Retry Logic

```javascript
// Retry mechanism for failed operations
export const retryOperation = async (operation, maxRetries = 3, delay = 1000) => {
  let lastError;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`Attempt ${attempt}/${maxRetries}`);
      const result = await operation();
      
      if (result.success) {
        return result;
      }
      
      lastError = result;
      
      // Don't retry for certain errors
      if (result.code === 'PERMISSION_DENIED' || result.code === 'INVALID_ARGUMENT') {
        break;
      }
      
    } catch (error) {
      lastError = { success: false, error: error.message };
    }

    // Wait before retry (exponential backoff)
    if (attempt < maxRetries) {
      await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, attempt - 1)));
    }
  }

  return lastError;
};

// Usage example
const saveAnalysisWithRetry = async (userId, analysisData, analysisType) => {
  const operation = () => {
    return analysisType === 'skin' 
      ? saveSkinAnalysis(userId, analysisData)
      : saveHairAnalysis(userId, analysisData);
  };

  return await retryOperation(operation, 3, 1000);
};
```

---

**Next**: [Security & Firestore Rules Guide](./security-rules.md)
