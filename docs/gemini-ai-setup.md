# Gemini AI Configuration & Integration Guide

This guide explains how Google's Gemini AI is integrated for advanced image analysis in both skin and hair analysis features.

## 🤖 Gemini AI Setup

### 1. Google AI Studio Configuration

1. **Create Google Cloud Project**
   ```
   1. Visit https://aistudio.google.com/
   2. Sign in with Google account
   3. Create new project or select existing
   4. Enable Gemini API access
   ```

2. **Generate API Key**
   ```
   1. Go to API Keys section
   2. Click "Create API Key"
   3. Copy the generated key
   4. Store securely in environment variables
   ```

3. **API Configuration**
   ```
  Model: gemini-2.5-flash
   Endpoint: https://generativelanguage.googleapis.com/v1beta/models/
   Features: Vision + Text Generation
   Rate Limits: Check current quotas
   ```

### 2. Environment Setup

**File**: `.env`

```env
REACT_APP_GEMINI_API_KEY=AIzaSyAixsI1SMdzQ4BWasEtZvcPzlhLR7LeruA
```

## 🔬 AI Analysis Implementation

### 1. Base64 Image Conversion

```javascript
// Helper function to convert image file to base64
const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new window.FileReader();
    reader.onload = () => resolve(reader.result.split(',')[1]);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};
```

### 2. Gemini API Request Structure

```javascript
const makeGeminiRequest = async (imageBase64, promptText) => {
  const API_KEY = process.env.REACT_APP_GEMINI_API_KEY;
  
  const requestBody = {
    contents: [{
      parts: [
        {
          text: promptText
        },
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

  const response = await fetch(
  `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody)
    }
  );

  return response;
};
```

## 🧴 Skin Analysis AI Implementation

**Component**: `src/Components/skinScan.js`

### 1. Comprehensive Skin Analysis Prompt

```javascript
const generateSkinAnalysisPrompt = (age, gender, skinType) => {
  return `As a dermatology AI assistant, please analyze this skin image for the following user:

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
};
```

### 2. Skin Analysis Function

```javascript
const analyzeWithAI = async (imageBase64) => {
  try {
    setIsAnalyzing(true);
    
    const apiKey = process.env.REACT_APP_GEMINI_API_KEY;
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

    // Prepare comprehensive prompt
    const prompt = generateSkinAnalysisPrompt(age, gender, skinType);

    const body = {
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

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('API Error:', errorData);
      throw new Error(`API request failed: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    
    const resultText = data?.candidates?.[0]?.content?.parts?.[0]?.text || 
                     'No analysis could be generated. Please try again with a clearer image.';

    setAnalysisResult(resultText);
    showMessage('AI analysis complete! Saving to your profile...', 'success');

    return resultText;

  } catch (error) {
    console.error('AI Analysis Error:', error);
    throw new Error(`AI analysis failed: ${error.message}`);
  } finally {
    setIsAnalyzing(false);
  }
};
```

## 💇 Hair Analysis AI Implementation

**Component**: `src/Components/hairScan.js`

### 1. Comprehensive Hair Analysis Prompt

```javascript
const generateHairAnalysisPrompt = (age, gender, hairType) => {
  return `As a professional trichologist and hair analysis AI assistant, please analyze this hair image for a ${age}-year-old ${gender} with ${hairType} hair type. Provide a comprehensive analysis including:

HAIR CONDITION ASSESSMENT:
- Overall hair health and condition
- Hair texture and thickness
- Scalp condition visibility
- Hair density and coverage

POTENTIAL ISSUES IDENTIFIED:
- Hair loss or thinning patterns
- Scalp conditions (dryness, oiliness, dandruff)
- Hair damage (breakage, split ends, dryness)
- Any signs of hair disorders

HAIR CARE RECOMMENDATIONS:
- Suitable shampoo and conditioner types
- Hair treatments and masks
- Styling recommendations
- Products to avoid

LIFESTYLE AND NUTRITION TIPS:
- Dietary recommendations for hair health
- Vitamins and supplements if needed
- Hair care routine suggestions
- Environmental protection tips

WHEN TO CONSULT A SPECIALIST:
- Signs that require professional help
- Dermatologist or trichologist consultation

Please provide practical, actionable advice. Be thorough but easy to understand. Focus on the specific hair type: ${hairType}.

IMPORTANT: This analysis is for educational purposes only and should not replace professional medical or trichological advice.`;
};
```

### 2. Hair Analysis Function

```javascript
const analyzeWithAI = async (imageBase64) => {
  try {
    setIsAnalyzing(true);
    
    const API_KEY = process.env.REACT_APP_GEMINI_API_KEY;
    
  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [
            {
              text: generateHairAnalysisPrompt(age, gender, hairType)
            },
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
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      
      if (response.status === 429) {
        throw new Error('API quota exceeded. Please try again later.');
      } else if (response.status === 403) {
        throw new Error('API access denied. Please check your API key.');
      } else {
        throw new Error(`API request failed: ${response.status}`);
      }
    }

    const data = await response.json();
    
    if (data.candidates && data.candidates[0] && data.candidates[0].content) {
      const resultText = data.candidates[0].content.parts[0].text;
      setAnalysisResult(resultText);
      return resultText;
    } else {
      console.error('Invalid API response format:', data);
      throw new Error('Invalid response format from AI service');
    }
  } catch (error) {
    console.error('Hair Analysis Error:', error);
    setAnalysisResult(null);
    throw new Error(`Hair analysis failed: ${error.message}`);
  } finally {
    setIsAnalyzing(false);
  }
};
```

## 🔒 Safety and Content Filtering

### 1. Safety Settings Configuration

```javascript
const safetySettings = [
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
];
```

### 2. Response Validation

```javascript
const validateAIResponse = (response) => {
  // Check if response contains appropriate content
  if (!response || typeof response !== 'string') {
    throw new Error('Invalid AI response format');
  }

  // Check for minimum content length
  if (response.length < 100) {
    throw new Error('AI response too short - please try again');
  }

  // Check for harmful content indicators
  const harmfulIndicators = ['harmful', 'dangerous', 'inappropriate'];
  const containsHarmful = harmfulIndicators.some(indicator => 
    response.toLowerCase().includes(indicator)
  );

  if (containsHarmful) {
    throw new Error('AI detected inappropriate content');
  }

  return true;
};
```

## ⚡ Performance Optimization

### 1. Image Preprocessing

```javascript
const preprocessImage = async (file) => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      // Resize to optimal dimensions
      const maxDimension = 1024;
      let { width, height } = img;

      if (width > height) {
        if (width > maxDimension) {
          height = (height * maxDimension) / width;
          width = maxDimension;
        }
      } else {
        if (height > maxDimension) {
          width = (width * maxDimension) / height;
          height = maxDimension;
        }
      }

      canvas.width = width;
      canvas.height = height;

      // Draw and compress
      ctx.drawImage(img, 0, 0, width, height);
      
      canvas.toBlob(resolve, 'image/jpeg', 0.8);
    };

    img.src = URL.createObjectURL(file);
  });
};
```

### 2. Request Optimization

```javascript
const optimizedAnalyzeWithAI = async (imageFile) => {
  try {
    // 1. Preprocess image
    const optimizedImage = await preprocessImage(imageFile);
    
    // 2. Convert to base64
    const base64Image = await fileToBase64(optimizedImage);
    
    // 3. Make API request with retry logic
    let retries = 3;
    let lastError;

    while (retries > 0) {
      try {
        const result = await makeGeminiRequest(base64Image);
        return result;
      } catch (error) {
        lastError = error;
        retries--;
        
        if (retries > 0) {
          // Wait before retry (exponential backoff)
          await new Promise(resolve => setTimeout(resolve, Math.pow(2, 3 - retries) * 1000));
        }
      }
    }

    throw lastError;

  } catch (error) {
    throw new Error(`Optimized analysis failed: ${error.message}`);
  }
};
```

## 📊 Error Handling and Monitoring

### 1. Comprehensive Error Handling

```javascript
const handleAIAnalysisError = (error, context) => {
  console.error(`AI Analysis Error in ${context}:`, error);

  // Categorize errors
  if (error.message.includes('429')) {
    return {
      type: 'quota_exceeded',
      message: 'API quota exceeded. Please try again later.',
      suggestion: 'Wait a few minutes before trying again.'
    };
  }

  if (error.message.includes('403')) {
    return {
      type: 'access_denied',
      message: 'API access denied. Please check configuration.',
      suggestion: 'Contact support if this persists.'
    };
  }

  if (error.message.includes('400')) {
    return {
      type: 'bad_request',
      message: 'Invalid request format.',
      suggestion: 'Please try uploading a different image.'
    };
  }

  if (error.message.includes('network')) {
    return {
      type: 'network_error',
      message: 'Network connection issue.',
      suggestion: 'Check your internet connection and try again.'
    };
  }

  return {
    type: 'unknown_error',
    message: 'An unexpected error occurred.',
    suggestion: 'Please try again or contact support.'
  };
};
```

### 2. Usage Analytics

```javascript
const trackAIUsage = async (analysisType, success, processingTime) => {
  try {
    // Track usage metrics
    const usageData = {
      analysisType,
      success,
      processingTime,
      timestamp: new Date().toISOString(),
      userId: auth.currentUser?.uid
    };

    // Log to analytics service
    await logAnalytics('ai_analysis_usage', usageData);

  } catch (error) {
    console.error('Analytics tracking error:', error);
  }
};
```

## 🔧 API Configuration Management

### 1. Rate Limiting

```javascript
class RateLimiter {
  constructor(maxRequests = 10, timeWindow = 60000) {
    this.maxRequests = maxRequests;
    this.timeWindow = timeWindow;
    this.requests = [];
  }

  async checkLimit() {
    const now = Date.now();
    
    // Remove old requests
    this.requests = this.requests.filter(
      time => now - time < this.timeWindow
    );

    if (this.requests.length >= this.maxRequests) {
      const oldestRequest = Math.min(...this.requests);
      const waitTime = this.timeWindow - (now - oldestRequest);
      
      throw new Error(`Rate limit exceeded. Wait ${Math.ceil(waitTime / 1000)} seconds.`);
    }

    this.requests.push(now);
  }
}

const aiRateLimiter = new RateLimiter(10, 60000); // 10 requests per minute
```

### 2. Model Configuration

```javascript
const geminiConfig = {
  model: 'gemini-2.5-flash',
  maxTokens: 4096,
  temperature: 0.7,
  topP: 0.8,
  topK: 40,
  safetySettings: [
    {
      category: "HARM_CATEGORY_HARASSMENT",
      threshold: "BLOCK_MEDIUM_AND_ABOVE"
    }
  ],
  generationConfig: {
    stopSequences: ["END_ANALYSIS"],
    maxOutputTokens: 2048,
    temperature: 0.3,
    topP: 0.8,
    topK: 10
  }
};
```

## 🧪 Testing and Validation

### 1. Response Quality Testing

```javascript
const validateAnalysisQuality = (response, analysisType) => {
  const requiredSections = analysisType === 'skin' ? 
    ['SKIN CONDITION', 'RECOMMENDATIONS', 'DERMATOLOGIST'] :
    ['HAIR CONDITION', 'CARE RECOMMENDATIONS', 'SPECIALIST'];

  const missingSection = requiredSections.find(section => 
    !response.toUpperCase().includes(section)
  );

  if (missingSection) {
    throw new Error(`Analysis incomplete: Missing ${missingSection} section`);
  }

  return true;
};
```

### 2. Performance Monitoring

```javascript
const monitorAIPerformance = async (analysisFunction) => {
  const startTime = performance.now();
  
  try {
    const result = await analysisFunction();
    const endTime = performance.now();
    const duration = endTime - startTime;

    // Log performance metrics
    console.log(`AI Analysis completed in ${duration.toFixed(2)}ms`);
    
    return result;
  } catch (error) {
    const endTime = performance.now();
    const duration = endTime - startTime;
    
    console.error(`AI Analysis failed after ${duration.toFixed(2)}ms:`, error);
    throw error;
  }
};
```

## 🔧 Troubleshooting

### Common Issues:

1. **"API key not valid"**
   - Verify REACT_APP_GEMINI_API_KEY in .env
   - Check API key permissions in Google AI Studio

2. **"Quota exceeded"**
   - Check daily/monthly quota limits
   - Implement rate limiting
   - Consider upgrading plan

3. **"Invalid image format"**
   - Ensure image is JPEG/PNG
   - Check base64 encoding
   - Verify image size limits

4. **"Analysis timeout"**
   - Reduce image size
   - Implement proper error handling
   - Add retry logic

### Debug Mode:

```javascript
const debugGeminiAPI = async (imageBase64, prompt) => {
  console.log('API Key present:', !!process.env.REACT_APP_GEMINI_API_KEY);
  console.log('Image size:', imageBase64.length);
  console.log('Prompt length:', prompt.length);
  
  try {
    const response = await makeGeminiRequest(imageBase64, prompt);
    console.log('API Response status:', response.status);
    
    const data = await response.json();
    console.log('Response data:', data);
    
    return data;
  } catch (error) {
    console.error('Debug API call failed:', error);
    throw error;
  }
};
```

---

**Next**: [Skin Analysis System Guide](./skin-analysis.md)
