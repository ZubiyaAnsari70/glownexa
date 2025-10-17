// Browser-compatible Cloudinary configuration for image uploads
// This implementation works directly with Cloudinary's REST API without Node.js dependencies

// Cloudinary configuration
const cloudinaryConfig = {
  cloud_name: process.env.REACT_APP_CLOUDINARY_CLOUD_NAME,
  upload_preset: process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET,
  
};

// Upload image to Cloudinary using unsigned upload (browser-compatible)
export const uploadToCloudinary = async (file) => {
  try {
    // Validate environment variables
    if (!cloudinaryConfig.cloud_name || !cloudinaryConfig.upload_preset) {
      throw new Error('Cloudinary configuration is incomplete. Please check your environment variables.');
    }

    // Validate file
    if (!file) {
      throw new Error('No file provided');
    }

    // Check file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      throw new Error('File size exceeds 10MB limit');
    }

    // Check file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      throw new Error('File type not supported. Please upload JPG, PNG, or WebP images.');
    }

    // Create FormData for upload
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', cloudinaryConfig.upload_preset);
    formData.append('cloud_name', cloudinaryConfig.cloud_name);
    
    // Optional: Add folder organization
    formData.append('folder', 'skin_analysis');
    
    // Optional: Add tags for better organization
    formData.append('tags', 'skin_analysis,glownexa');
    
    // Optional: Add context metadata
    const timestamp = new Date().toISOString();
    formData.append('context', `upload_date=${timestamp}|source=glownexa_app`);

    // Upload to Cloudinary
    const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudinaryConfig.cloud_name}/image/upload`;
    
    const response = await fetch(uploadUrl, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Cloudinary upload error:', errorData);
      throw new Error(`Upload failed: ${errorData.error?.message || response.statusText}`);
    }

    const data = await response.json();
    
    // Return success response with all necessary data
    return {
      success: true,
      url: data.secure_url,
      public_id: data.public_id,
      format: data.format,
      bytes: data.bytes,
      width: data.width,
      height: data.height,
      created_at: data.created_at,
      resource_type: data.resource_type,
      cloudinary_data: data
    };

  } catch (error) {
    console.error('Cloudinary upload error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Generate Cloudinary URL with transformations (for future use)
export const generateCloudinaryUrl = (publicId, transformations = {}) => {
  if (!cloudinaryConfig.cloud_name || !publicId) {
    return null;
  }

  let transformString = '';
  if (Object.keys(transformations).length > 0) {
    const transforms = [];
    
    if (transformations.width) transforms.push(`w_${transformations.width}`);
    if (transformations.height) transforms.push(`h_${transformations.height}`);
    if (transformations.quality) transforms.push(`q_${transformations.quality}`);
    if (transformations.format) transforms.push(`f_${transformations.format}`);
    if (transformations.crop) transforms.push(`c_${transformations.crop}`);
    
    if (transforms.length > 0) {
      transformString = `/${transforms.join(',')}`;
    }
  }

  return `https://res.cloudinary.com/${cloudinaryConfig.cloud_name}/image/upload${transformString}/${publicId}`;
};

// Delete image from Cloudinary (requires signed request - for future admin features)
export const deleteFromCloudinary = async (publicId) => {
  try {
    // Note: This requires server-side implementation for security
    // For now, we'll just return a placeholder
    console.log('Delete functionality requires server-side implementation for security');
    return {
      success: false,
      error: 'Delete functionality requires server-side implementation'
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
};

export default cloudinaryConfig;
