# Cloudinary Integration Guide

This guide explains how Cloudinary is integrated for secure image upload, storage, and optimization in the Glownexa application.

## ☁️ Cloudinary Setup

### 1. Account Configuration

1. **Create Cloudinary Account**
   ```
   1. Visit https://cloudinary.com/
   2. Sign up for free account
   3. Verify email address
   4. Access dashboard
   ```

2. **Get API Credentials**
   ```
   Dashboard → Settings → API Keys
   
   Required credentials:
   - Cloud Name: dqjbmpgsp
   - API Key: 162867348462873
   - API Secret: wW44eoe3sEPtxOBTXLrqBr6575o
   ```

3. **Create Upload Preset**
   ```
   Settings → Upload → Upload presets → Add upload preset
   
   Preset Configuration:
   - Name: skin_analysis_preset
   - Signing Mode: Unsigned
   - Folder: glownexa-uploads
   - Resource Type: Auto
   - Access Mode: Public
   ```

### 2. Environment Variables

**File**: `.env`

```env
REACT_APP_CLOUDINARY_CLOUD_NAME=dqjbmpgsp
REACT_APP_CLOUDINARY_API_KEY=162867348462873
REACT_APP_CLOUDINARY_UPLOAD_PRESET=skin_analysis_preset
REACT_APP_CLOUDINARY_API_SECRET=wW44eoe3sEPtxOBTXLrqBr6575o
```

## 📁 Cloudinary Service Implementation

**File**: `src/Components/cloudinary.js`

### Core Upload Function:

```javascript
export const uploadToCloudinary = async (file) => {
  try {
    // 1. Validate file
    if (!file) {
      throw new Error('No file provided for upload');
    }

    // 2. Check file type
    if (!file.type.startsWith('image/')) {
      throw new Error('Only image files are allowed');
    }

    // 3. Check file size (10MB limit)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      throw new Error('File size exceeds 10MB limit');
    }

    console.log('Starting Cloudinary upload for file:', file.name);

    // 4. Create FormData
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET);
    formData.append('cloud_name', process.env.REACT_APP_CLOUDINARY_CLOUD_NAME);
    formData.append('folder', 'glownexa-uploads');

    // 5. Upload to Cloudinary
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    // 6. Handle response
    if (!response.ok) {
      const errorData = await response.text();
      console.error('Cloudinary upload failed:', errorData);
      throw new Error(`Upload failed: ${response.status}`);
    }

    // 7. Parse result
    const result = await response.json();
    console.log('Cloudinary upload successful:', result.secure_url);

    // 8. Return standardized response
    return {
      success: true,
      url: result.secure_url,
      public_id: result.public_id,
      width: result.width,
      height: result.height,
      format: result.format,
      bytes: result.bytes,
      created_at: result.created_at
    };

  } catch (error) {
    console.error('Cloudinary upload error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};
```

## 🖼️ Image Upload Workflow

### 1. Client-Side Validation

```javascript
const validateImage = (file) => {
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  const maxSize = 10 * 1024 * 1024; // 10MB

  if (!file) {
    throw new Error('Please select a file');
  }

  if (!validTypes.includes(file.type)) {
    throw new Error('Please upload a valid image (JPEG, PNG, WebP)');
  }

  if (file.size > maxSize) {
    throw new Error('File size must be less than 10MB');
  }

  return true;
};
```

### 2. Upload Process in Skin Analysis

**Component**: `src/Components/skinScan.js`

```javascript
const handleSubmit = async (e) => {
  e.preventDefault();
  
  try {
    // Step 1: Validate inputs
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

    // Step 3: Continue with AI analysis...
    // ... rest of the process

  } catch (error) {
    console.error('Upload error:', error);
    showMessage(`Error: ${error.message}`, 'error');
    setUploadingToCloudinary(false);
    setIsAnalyzing(false);
  }
};
```

### 3. Upload Process in Hair Analysis

**Component**: `src/Components/hairScan.js`

```javascript
const handleSubmit = async (e) => {
  e.preventDefault();
  
  try {
    // Validation and setup
    if (!file || !age || !gender || !hairType) {
      showMessage('Please fill in all fields and upload an image.', 'error');
      return;
    }

    setIsAnalyzing(true);
    setUploadingToCloudinary(true);
    showMessage('Uploading image...', 'info');

    // Upload to Cloudinary
    const cloudinaryResult = await uploadToCloudinary(file);
    
    if (!cloudinaryResult.success) {
      throw new Error(`Cloudinary upload failed: ${cloudinaryResult.error}`);
    }
    
    setUploadingToCloudinary(false);
    showMessage('Image uploaded successfully!', 'success');

    // Continue with analysis...

  } catch (error) {
    console.error('Error during hair analysis:', error);
    setAnalysisResult(null);
    setUploadingToCloudinary(false);
    setIsAnalyzing(false);
    showMessage(`Analysis failed: ${error.message}`, 'error');
  }
};
```

## 🔧 Advanced Cloudinary Features

### 1. Image Transformations

```javascript
// Generate optimized URLs with transformations
const getOptimizedImageUrl = (publicId) => {
  const cloudName = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME;
  
  return `https://res.cloudinary.com/${cloudName}/image/upload/` +
         `c_fill,w_800,h_600,q_auto,f_auto/${publicId}`;
};

// Thumbnail generation
const getThumbnailUrl = (publicId) => {
  const cloudName = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME;
  
  return `https://res.cloudinary.com/${cloudName}/image/upload/` +
         `c_thumb,w_200,h_200,g_face,q_auto,f_auto/${publicId}`;
};
```

### 2. Upload Progress Tracking

```javascript
export const uploadWithProgress = async (file, onProgress) => {
  return new Promise((resolve, reject) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET);

    const xhr = new XMLHttpRequest();

    // Track upload progress
    xhr.upload.addEventListener('progress', (event) => {
      if (event.lengthComputable) {
        const percentComplete = (event.loaded / event.total) * 100;
        onProgress(percentComplete);
      }
    });

    xhr.addEventListener('load', () => {
      if (xhr.status === 200) {
        const result = JSON.parse(xhr.responseText);
        resolve({
          success: true,
          url: result.secure_url,
          public_id: result.public_id
        });
      } else {
        reject(new Error(`Upload failed: ${xhr.status}`));
      }
    });

    xhr.addEventListener('error', () => {
      reject(new Error('Network error during upload'));
    });

    xhr.open('POST', `https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}/image/upload`);
    xhr.send(formData);
  });
};
```

### 3. Secure Upload with Signature

```javascript
// For production use, implement server-side signature generation
export const uploadWithSignature = async (file, signature, timestamp) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('signature', signature);
  formData.append('timestamp', timestamp);
  formData.append('api_key', process.env.REACT_APP_CLOUDINARY_API_KEY);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}/image/upload`,
    {
      method: 'POST',
      body: formData,
    }
  );

  return await response.json();
};
```

## 🖼️ Image Display and Management

### 1. Responsive Image Component

```javascript
const CloudinaryImage = ({ publicId, alt, className }) => {
  const cloudName = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME;
  
  const baseUrl = `https://res.cloudinary.com/${cloudName}/image/upload/`;
  
  return (
    <img
      src={`${baseUrl}c_fill,w_auto,h_auto,q_auto,f_auto/${publicId}`}
      alt={alt}
      className={className}
      loading="lazy"
    />
  );
};
```

### 2. Error Handling for Images

```javascript
const ImageWithFallback = ({ src, fallback, alt, ...props }) => {
  const [imgSrc, setImgSrc] = useState(src);
  
  const handleError = () => {
    setImgSrc(fallback);
  };
  
  return (
    <img
      src={imgSrc}
      alt={alt}
      onError={handleError}
      {...props}
    />
  );
};
```

## 📊 Storage Management

### 1. File Organization Structure

```
glownexa-uploads/
├── skin-analysis/
│   ├── user-{userId}/
│   │   ├── {timestamp}-{filename}
│   │   └── ...
├── hair-analysis/
│   ├── user-{userId}/
│   │   ├── {timestamp}-{filename}
│   │   └── ...
└── profile-images/
    ├── user-{userId}/
    │   ├── avatar-{timestamp}
    │   └── ...
```

### 2. Cleanup and Optimization

```javascript
// Delete old images (implement server-side)
export const deleteCloudinaryImage = async (publicId) => {
  // This should be done server-side for security
  const timestamp = Math.round(new Date().getTime() / 1000);
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  
  // Generate signature for deletion
  const signature = generateSignature(publicId, timestamp, apiSecret);
  
  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}/image/destroy`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        public_id: publicId,
        signature: signature,
        api_key: process.env.REACT_APP_CLOUDINARY_API_KEY,
        timestamp: timestamp,
      }),
    }
  );
  
  return await response.json();
};
```

## 🔒 Security Best Practices

### 1. Upload Restrictions

```javascript
const uploadPresetConfig = {
  folder: 'glownexa-uploads',
  allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
  max_file_size: 10485760, // 10MB
  max_image_width: 4000,
  max_image_height: 4000,
  quality: 'auto',
  fetch_format: 'auto'
};
```

### 2. Content Moderation

```javascript
// Enable automatic content moderation
const moderationSettings = {
  moderation: 'aws_rek',
  notification_url: 'https://your-api.com/webhook/moderation',
  auto_tagging: 0.7 // Confidence threshold
};
```

### 3. Access Control

```javascript
// Implement resource access control
const getSecureImageUrl = (publicId, userId) => {
  // Only allow users to access their own images
  if (!isAuthorizedUser(userId)) {
    throw new Error('Unauthorized access');
  }
  
  return generateCloudinaryUrl(publicId);
};
```

## 📈 Performance Optimization

### 1. Lazy Loading

```javascript
const LazyImage = ({ src, alt, ...props }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  
  return (
    <div className="relative">
      {!imageLoaded && (
        <div className="skeleton-loader animate-pulse bg-gray-300" />
      )}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        onLoad={() => setImageLoaded(true)}
        className={imageLoaded ? 'block' : 'hidden'}
        {...props}
      />
    </div>
  );
};
```

### 2. Progressive Loading

```javascript
const ProgressiveImage = ({ src, placeholder, alt }) => {
  const [currentSrc, setCurrentSrc] = useState(placeholder);
  
  useEffect(() => {
    const img = new Image();
    img.onload = () => setCurrentSrc(src);
    img.src = src;
  }, [src]);
  
  return (
    <img
      src={currentSrc}
      alt={alt}
      className={currentSrc === placeholder ? 'blur-sm' : 'blur-none'}
    />
  );
};
```

## 🔧 Troubleshooting

### Common Issues:

1. **"Upload failed: 400"**
   - Check upload preset configuration
   - Verify file format is allowed

2. **"Invalid cloud name"**
   - Verify REACT_APP_CLOUDINARY_CLOUD_NAME in .env

3. **"Upload preset not found"**
   - Ensure upload preset exists and is unsigned

4. **Large file upload timeouts**
   - Implement chunked upload for large files
   - Add retry logic

### Debug Mode:

```javascript
// Enable detailed logging for debugging
const debugUpload = async (file) => {
  console.log('File details:', {
    name: file.name,
    size: file.size,
    type: file.type
  });
  
  const result = await uploadToCloudinary(file);
  
  console.log('Upload result:', result);
  
  return result;
};
```

---

**Next**: [Gemini AI Configuration Guide](./gemini-ai-setup.md)
