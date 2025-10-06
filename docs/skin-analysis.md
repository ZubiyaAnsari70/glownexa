# Skin Analysis System Guide

This guide explains the complete skin analysis workflow, from image upload to AI-powered analysis and result display.

## 🧴 Skin Analysis Overview

The skin analysis system provides comprehensive dermatological assessment using AI-powered image analysis, helping users understand their skin condition and receive personalized recommendations.

### Key Features:
- **AI-Powered Analysis**: Advanced computer vision for skin assessment
- **Personalized Results**: Tailored recommendations based on user profile
- **Professional Insights**: Dermatology-grade analysis and suggestions
- **Historical Tracking**: Analysis history for progress monitoring

## 📱 User Interface Components

**Component**: `src/Components/skinScan.js`

### 1. Main Interface Structure

```javascript
const SkinScan = () => {
  // State management for the component
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [skinType, setSkinType] = useState('');
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [analysisResult, setAnalysisResult] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [uploadingToCloudinary, setUploadingToCloudinary] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  // Component render with form and results
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-purple-100">
      {/* Header */}
      {/* User Input Form */}
      {/* Image Upload */}
      {/* Analysis Results */}
    </div>
  );
};
```

### 2. User Information Form

```javascript
{/* Age Selection */}
<div>
  <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
    <Baby className="h-4 w-4 mr-2 text-purple-600" />
    Age Range
  </label>
  <select
    value={age}
    onChange={(e) => setAge(e.target.value)}
    className="w-full p-3 border-2 border-purple-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
    required
  >
    <option value="">Select your age range</option>
    <option value="13-17">13-17 years</option>
    <option value="18-25">18-25 years</option>
    <option value="26-35">26-35 years</option>
    <option value="36-45">36-45 years</option>
    <option value="46-55">46-55 years</option>
    <option value="56+">56+ years</option>
  </select>
</div>

{/* Gender Selection */}
<div>
  <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
    <User className="h-4 w-4 mr-2 text-purple-600" />
    Gender
  </label>
  <select
    value={gender}
    onChange={(e) => setGender(e.target.value)}
    className="w-full p-3 border-2 border-purple-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
    required
  >
    <option value="">Select gender</option>
    <option value="Male">Male</option>
    <option value="Female">Female</option>
    <option value="Other">Other</option>
  </select>
</div>

{/* Skin Type Selection */}
<div>
  <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
    <Sun className="h-4 w-4 mr-2 text-purple-600" />
    Skin Type
  </label>
  <select
    value={skinType}
    onChange={(e) => setSkinType(e.target.value)}
    className="w-full p-3 border-2 border-purple-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
    required
  >
    <option value="">Select your skin type</option>
    <option value="Oily">Oily</option>
    <option value="Dry">Dry</option>
    <option value="Combination">Combination</option>
    <option value="Sensitive">Sensitive</option>
    <option value="Normal">Normal</option>
  </select>
</div>
```

### 3. Image Upload Interface

```javascript
{/* Image Upload Section */}
<div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-purple-100">
  <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
    <Camera className="h-6 w-6 mr-2 text-purple-600" />
    Upload Your Skin Photo
  </h3>
  
  <div className="border-2 border-dashed border-purple-300 rounded-xl p-8 text-center hover:border-purple-500 transition-colors duration-300">
    <input
      type="file"
      accept="image/*"
      onChange={handleFileChange}
      className="hidden"
      id="skinImage"
      required
    />
    
    <label
      htmlFor="skinImage"
      className="cursor-pointer flex flex-col items-center space-y-4"
    >
      {preview ? (
        <div className="relative">
          <img
            src={preview}
            alt="Preview"
            className="max-w-full max-h-64 rounded-lg shadow-lg"
          />
          <button
            type="button"
            onClick={clearImage}
            className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <>
          <Camera className="h-16 w-16 text-purple-400" />
          <p className="text-lg font-medium text-gray-700">
            Click to upload your skin photo
          </p>
          <p className="text-sm text-gray-500">
            Supports JPEG, PNG (Max 10MB)
          </p>
        </>
      )}
    </label>
  </div>
</div>
```

## 🔄 Analysis Workflow

### 1. Complete Analysis Process

```javascript
const handleSubmit = async (e) => {
  e.preventDefault();
  
  try {
    // Step 1: Input Validation
    if (!file || !age || !gender || !skinType) {
      showMessage('Please fill in all fields and upload an image.', 'error');
      return;
    }

    setIsAnalyzing(true);
    showMessage('Starting analysis...', 'info');

    // Step 2: Upload to Cloudinary
    setUploadingToCloudinary(true);
    showMessage('Uploading image to cloud storage...', 'info');

    const cloudinaryResult = await uploadToCloudinary(file);
    
    if (!cloudinaryResult.success) {
      throw new Error(`Image upload failed: ${cloudinaryResult.error}`);
    }

    setUploadingToCloudinary(false);
    showMessage('Image uploaded successfully! Analyzing with AI...', 'success');

    // Step 3: Convert image to base64 for Gemini API
    const imageBase64 = await fileToBase64(file);
    
    // Step 4: Call Gemini API for analysis
    const apiKey = process.env.REACT_APP_GEMINI_API_KEY;
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(createAnalysisRequestBody(imageBase64))
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`API request failed: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    const resultText = data?.candidates?.[0]?.content?.parts?.[0]?.text || 
                     'No analysis could be generated. Please try again with a clearer image.';

    setAnalysisResult(resultText);
    showMessage('AI analysis complete! Saving to your profile...', 'success');

    // Step 5: Save analysis data to Firestore
    const analysisData = {
      age: parseInt(age),
      gender: gender,
      skinType: skinType,
      originalFileName: file.name,
      cloudinaryUrl: cloudinaryResult.url,
      cloudinaryPublicId: cloudinaryResult.public_id,
      aiAnalysis: resultText
    };

    const saveResult = await saveSkinAnalysis(currentUser.uid, analysisData);
    
    if (saveResult.success) {
      showMessage('Skin analysis completed and saved successfully!', 'success');
    } else {
      showMessage('Analysis completed but failed to save. Please try again.', 'warning');
    }

  } catch (error) {
    console.error('Analysis error:', error);
    setAnalysisResult(null);
    setUploadingToCloudinary(false);
    setIsAnalyzing(false);
    showMessage(`Analysis failed: ${error.message}`, 'error');
  } finally {
    setIsAnalyzing(false);
  }
};
```

### 2. Analysis Request Body Generation

```javascript
const createAnalysisRequestBody = (imageBase64) => {
  const prompt = `As a dermatology AI assistant, please analyze this skin image for the following user:

User Details:
- Age: ${age} years
- Gender: ${gender}
- Skin Type: ${skinType}

Please provide a comprehensive analysis in the following format:

1. SKIN CONDITION ASSESSMENT:
   - Overall skin condition
   - Any visible concerns or abnormalities
   - Skin texture and appearance

2. POTENTIAL ISSUES IDENTIFIED:
   - List any potential skin problems visible
   - Severity level (mild/moderate/severe)
   - Areas of concern

3. RECOMMENDATIONS:
   - Daily skincare routine suggestions
   - Product recommendations for ${skinType} skin
   - Lifestyle changes that may help

4. WHEN TO CONSULT A DERMATOLOGIST:
   - Warning signs that require professional attention
   - Recommended follow-up timeline

5. PREVENTION TIPS:
   - How to prevent future skin issues
   - Sun protection recommendations
   - Diet and lifestyle factors

Please be thorough but easy to understand. Focus on actionable advice for someone with ${skinType} skin type.

IMPORTANT: This is for educational purposes only and should not replace professional medical advice.`;

  return {
    contents: [{
      parts: [
        { text: prompt },
        {
          inline_data: {
            mime_type: "image/jpeg",
            data: imageBase64
          }
        }
      ]
    }],
    safetySettings: [
      {
        category: "HARM_CATEGORY_HARASSMENT",
        threshold: "BLOCK_MEDIUM_AND_ABOVE"
      },
      {
        category: "HARM_CATEGORY_HATE_SPEECH",
        threshold: "BLOCK_MEDIUM_AND_ABOVE"
      },
      {
        category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
        threshold: "BLOCK_MEDIUM_AND_ABOVE"
      },
      {
        category: "HARM_CATEGORY_DANGEROUS_CONTENT",
        threshold: "BLOCK_MEDIUM_AND_ABOVE"
      }
    ]
  };
};
```

## 📊 Results Display

### 1. Analysis Results Interface

```javascript
{analysisResult && (
  <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-purple-100">
    <div className="flex items-center justify-between mb-6">
      <h3 className="text-2xl font-bold text-gray-800 flex items-center">
        <Sparkles className="h-6 w-6 mr-2 text-purple-600" />
        Your Skin Analysis Results
      </h3>
      
      <div className="flex space-x-3">
        <button
          onClick={downloadAnalysis}
          className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-4 py-2 rounded-xl flex items-center space-x-2 transition-all duration-300 hover:scale-105 shadow-lg"
          title="Download Analysis Report"
        >
          <Download className="h-4 w-4" />
          <span className="hidden sm:inline">Download</span>
        </button>
        
        <button
          onClick={() => navigate('/history')}
          className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-4 py-2 rounded-xl flex items-center space-x-2 transition-all duration-300 hover:scale-105 shadow-lg"
          title="View Analysis History"
        >
          <History className="h-4 w-4" />
          <span className="hidden sm:inline">History</span>
        </button>
      </div>
    </div>
    
    <div className="prose prose-lg max-w-none">
      <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
        {analysisResult}
      </div>
    </div>
  </div>
)}
```

### 2. Progress Indicators

```javascript
{/* Analysis Progress */}
{(uploadingToCloudinary || isAnalyzing) && (
  <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-purple-100">
    <div className="flex items-center justify-center space-x-4">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      <div className="text-lg font-medium text-gray-700">
        {uploadingToCloudinary ? 'Uploading image...' : 
         isAnalyzing ? 'Analyzing your skin...' : 'Processing...'}
      </div>
    </div>
    
    <div className="mt-4 bg-gray-200 rounded-full h-2">
      <div 
        className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-500"
        style={{ 
          width: uploadingToCloudinary ? '33%' : 
                 isAnalyzing ? '66%' : '100%' 
        }}
      ></div>
    </div>
    
    <p className="text-sm text-gray-500 text-center mt-2">
      Please wait while we analyze your skin condition...
    </p>
  </div>
)}
```

## 💾 Data Storage Integration

### 1. Firestore Save Operation

```javascript
// From firestoreService.js
export const saveSkinAnalysis = async (userId, analysisData) => {
  try {
    const docRef = await addDoc(collection(db, 'skinAnalyses'), {
      userId: userId,
      analysisType: 'skin',
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
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error('Error saving skin analysis: ', error);
    return { success: false, error: error.message };
  }
};
```

### 2. Data Structure

```javascript
const skinAnalysisData = {
  userId: "user-unique-id",
  analysisType: "skin",
  age: 25,
  gender: "Female",
  skinType: "Combination",
  originalFileName: "skin-photo.jpg",
  cloudinaryUrl: "https://res.cloudinary.com/dqjbmpgsp/image/upload/v1234567890/glownexa-uploads/abc123.jpg",
  cloudinaryPublicId: "glownexa-uploads/abc123",
  aiAnalysis: "Detailed analysis text from Gemini AI...",
  createdAt: "2024-01-15T10:30:00Z",
  updatedAt: "2024-01-15T10:30:00Z"
};
```

## 📝 Download Functionality

### 1. Analysis Report Generation

```javascript
const downloadAnalysis = () => {
  if (!analysisResult) return;

  const analysisText = `
SKIN ANALYSIS REPORT
====================

User Information:
- Age: ${age}
- Gender: ${gender}
- Skin Type: ${skinType}
- Analysis Date: ${new Date().toLocaleDateString()}

AI Analysis Results:
${analysisResult}

Generated by Glownexa Skin Analysis AI
`;

  const blob = new Blob([analysisText], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `skin-analysis-${new Date().toISOString().split('T')[0]}.txt`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
```

## 🎨 UI/UX Features

### 1. Responsive Design

```css
/* Tailwind classes for responsive design */
.container {
  @apply min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-purple-100;
}

.form-section {
  @apply bg-white rounded-2xl shadow-xl p-8 border-2 border-purple-100;
}

.input-field {
  @apply w-full p-3 border-2 border-purple-200 rounded-xl 
         focus:ring-2 focus:ring-purple-500 focus:border-transparent 
         transition-all duration-300;
}

.submit-button {
  @apply w-full bg-gradient-to-r from-purple-600 to-pink-600 
         hover:from-purple-700 hover:to-pink-700 text-white font-bold 
         py-4 px-8 rounded-xl transition-all duration-300 
         transform hover:scale-105 shadow-lg;
}
```

### 2. Loading States

```javascript
const LoadingIndicator = ({ stage }) => {
  const stages = [
    { name: 'upload', label: 'Uploading image...' },
    { name: 'analyze', label: 'Analyzing skin...' },
    { name: 'save', label: 'Saving results...' }
  ];

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="flex space-x-2">
        {stages.map((s, index) => (
          <Circle
            key={s.name}
            className={`h-3 w-3 ${
              stage === s.name ? 'text-purple-600 fill-current' : 'text-gray-300'
            }`}
          />
        ))}
      </div>
      <p className="text-sm text-gray-600">
        {stages.find(s => s.name === stage)?.label}
      </p>
    </div>
  );
};
```

### 3. Message System

```javascript
const MessageDisplay = ({ message }) => {
  if (!message.text) return null;

  const messageStyles = {
    success: 'bg-green-100 border-green-400 text-green-700',
    error: 'bg-red-100 border-red-400 text-red-700',
    warning: 'bg-yellow-100 border-yellow-400 text-yellow-700',
    info: 'bg-blue-100 border-blue-400 text-blue-700'
  };

  return (
    <div className={`border-l-4 p-4 rounded-r-lg ${messageStyles[message.type]}`}>
      <p className="font-medium">{message.text}</p>
    </div>
  );
};
```

## 🔧 Error Handling

### 1. Comprehensive Error Management

```javascript
const handleAnalysisError = (error, stage) => {
  console.error(`Error in ${stage}:`, error);

  let userMessage = 'An unexpected error occurred. Please try again.';
  
  if (error.message.includes('network')) {
    userMessage = 'Network connection issue. Please check your internet.';
  } else if (error.message.includes('file size')) {
    userMessage = 'File too large. Please choose a smaller image.';
  } else if (error.message.includes('format')) {
    userMessage = 'Invalid file format. Please upload a JPEG or PNG image.';
  } else if (error.message.includes('quota')) {
    userMessage = 'Service temporarily unavailable. Please try again later.';
  }

  showMessage(userMessage, 'error');
  
  // Reset states
  setIsAnalyzing(false);
  setUploadingToCloudinary(false);
};
```

### 2. Input Validation

```javascript
const validateInputs = () => {
  const errors = [];

  if (!age) errors.push('Please select your age range');
  if (!gender) errors.push('Please select your gender');
  if (!skinType) errors.push('Please select your skin type');
  if (!file) errors.push('Please upload a skin photo');

  if (file && file.size > 10 * 1024 * 1024) {
    errors.push('File size must be less than 10MB');
  }

  if (file && !['image/jpeg', 'image/jpg', 'image/png'].includes(file.type)) {
    errors.push('Please upload a JPEG or PNG image');
  }

  if (errors.length > 0) {
    showMessage(errors.join('. '), 'error');
    return false;
  }

  return true;
};
```

## 📱 Mobile Optimization

### 1. Touch-Friendly Interface

```javascript
const MobileOptimizedUpload = () => {
  return (
    <div className="border-2 border-dashed border-purple-300 rounded-xl p-4 sm:p-8 text-center">
      <input
        type="file"
        accept="image/*"
        capture="camera" // Enable camera capture on mobile
        onChange={handleFileChange}
        className="hidden"
        id="skinImage"
      />
      
      <label htmlFor="skinImage" className="cursor-pointer block">
        <div className="flex flex-col items-center space-y-2 sm:space-y-4">
          <Camera className="h-12 w-12 sm:h-16 sm:w-16 text-purple-400" />
          <p className="text-base sm:text-lg font-medium text-gray-700">
            Take or upload photo
          </p>
          <p className="text-xs sm:text-sm text-gray-500">
            JPEG, PNG (Max 10MB)
          </p>
        </div>
      </label>
    </div>
  );
};
```

### 2. Progressive Enhancement

```javascript
const useMediaQuery = (query) => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);
    setMatches(mediaQuery.matches);

    const handler = (event) => setMatches(event.matches);
    mediaQuery.addEventListener('change', handler);
    
    return () => mediaQuery.removeEventListener('change', handler);
  }, [query]);

  return matches;
};

// Usage in component
const isMobile = useMediaQuery('(max-width: 768px)');
```

## 🔍 Performance Monitoring

### 1. Analysis Metrics Tracking

```javascript
const trackAnalysisMetrics = async (startTime, endTime, success) => {
  const duration = endTime - startTime;
  
  const metrics = {
    analysisType: 'skin',
    duration: duration,
    success: success,
    timestamp: new Date().toISOString(),
    userId: auth.currentUser?.uid
  };

  // Log to analytics
  console.log('Skin Analysis Metrics:', metrics);
  
  // Could send to analytics service
  // await sendAnalytics('skin_analysis_completed', metrics);
};
```

### 2. Performance Optimization

```javascript
const optimizeImageForAnalysis = async (file) => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      // Resize to optimal size for AI analysis
      const maxSize = 1024;
      let { width, height } = img;

      if (width > height) {
        if (width > maxSize) {
          height = (height * maxSize) / width;
          width = maxSize;
        }
      } else {
        if (height > maxSize) {
          width = (width * maxSize) / height;
          height = maxSize;
        }
      }

      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob(resolve, 'image/jpeg', 0.85);
    };

    img.src = URL.createObjectURL(file);
  });
};
```

---

**Next**: [Hair Analysis System Guide](./hair-analysis.md)
