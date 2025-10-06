# Deployment Guide

This comprehensive guide covers the complete deployment process for the Glownexa application, including local setup, production deployment, and maintenance procedures.

## 🚀 Production Deployment Overview

The Glownexa application is ready for production deployment with the following optimized build:

- **Build Size**: 204.99 kB (main.js), 10.49 kB (CSS)
- **Framework**: React 19.1.0 with Tailwind CSS
- **Services**: Firebase Authentication, Firestore, Cloudinary, Gemini AI
- **Security**: Firestore rules, protected routes, input validation

## 📋 Pre-Deployment Checklist

### 1. Environment Configuration

**✅ Environment Variables Setup**:
```bash
# Required environment variables (.env.production)
REACT_APP_FIREBASE_API_KEY=your_production_firebase_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your-project-id
REACT_APP_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
REACT_APP_GEMINI_API_KEY=your_production_gemini_key
REACT_APP_CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud
```

**✅ Service Configuration Verification**:
- [ ] Firebase project configured with Authentication and Firestore
- [ ] Firestore security rules deployed
- [ ] Cloudinary account setup with upload presets
- [ ] Gemini AI API key configured with appropriate quotas
- [ ] All environment variables verified in production

### 2. Code Quality Verification

**✅ Build Verification**:
```bash
# Verify production build
npm run build

# Expected output:
# File sizes after gzip:
#   204.99 kB  build/static/js/main.[hash].js
#   10.49 kB   build/static/css/main.[hash].css
#   1.76 kB    build/static/js/[chunk].[hash].chunk.js
```

**✅ Security Checklist**:
- [x] No console.log statements in production code
- [x] No test files or debug components
- [x] Environment variables properly configured
- [x] Firestore security rules deployed
- [x] Input validation implemented
- [x] Image upload restrictions configured

## 🌐 Deployment Methods

### 1. Firebase Hosting (Recommended)

Firebase Hosting provides seamless integration with Firebase services and optimal performance.

#### Initial Setup

```bash
# Install Firebase CLI globally
npm install -g firebase-cli

# Login to Firebase
firebase login

# Initialize Firebase in project directory
cd C:\Users\ojhap\Desktop\glownexa\glownexa
firebase init hosting

# Select your Firebase project
# Choose 'build' as public directory
# Configure as single-page app: Yes
# Overwrite index.html: No
```

#### Firebase Configuration

**File**: `firebase.json`
```json
{
  "hosting": {
    "public": "build",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ],
    "headers": [
      {
        "source": "**/*.@(jpg|jpeg|gif|png|svg|webp|js|css)",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "max-age=31536000"
          }
        ]
      },
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
  },
  "firestore": {
    "rules": "firestore.rules",
    "indexes": "firestore.indexes.json"
  }
}
```

#### Deployment Commands

```bash
# Build the application
npm run build

# Deploy to Firebase Hosting
firebase deploy --only hosting

# Deploy everything (hosting + firestore rules)
firebase deploy

# Deploy with specific message
firebase deploy -m "Production deployment v1.0"
```

#### Custom Domain Setup

```bash
# Add custom domain
firebase hosting:channel:add your-domain.com

# Or configure in Firebase Console:
# 1. Go to Firebase Console → Hosting
# 2. Click "Add custom domain"
# 3. Enter your domain
# 4. Follow DNS configuration instructions
```

### 2. Netlify Deployment

Netlify offers easy deployment with Git integration and excellent performance.

#### Manual Deployment

```bash
# Build the application
npm run build

# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Deploy from build directory
netlify deploy --dir=build --prod
```

#### Git-Based Deployment

1. **Connect Repository**: Link your GitHub repository to Netlify
2. **Build Settings**:
   - Build command: `npm run build`
   - Publish directory: `build`
3. **Environment Variables**: Add all `REACT_APP_*` variables in Netlify dashboard
4. **Deploy**: Netlify will automatically deploy on Git pushes

**Netlify Configuration** (`netlify.toml`):
```toml
[build]
  command = "npm run build"
  publish = "build"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[build.environment]
  NODE_VERSION = "18"
  NPM_VERSION = "9"

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
    X-XSS-Protection = "1; mode=block"
    Strict-Transport-Security = "max-age=31536000; includeSubDomains"

[[headers]]
  for = "/static/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"
```

### 3. Vercel Deployment

Vercel provides excellent performance with automatic optimizations.

#### CLI Deployment

```bash
# Install Vercel CLI
npm install -g vercel

# Build the application
npm run build

# Deploy to Vercel
vercel --prod

# Follow the prompts to configure deployment
```

#### Git Integration

1. **Import Project**: Connect your GitHub repository to Vercel
2. **Build Settings**:
   - Framework Preset: Create React App
   - Build Command: `npm run build`
   - Output Directory: `build`
3. **Environment Variables**: Add in Vercel dashboard
4. **Deploy**: Automatic deployment on Git pushes

**Vercel Configuration** (`vercel.json`):
```json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "build"
      }
    }
  ],
  "routes": [
    {
      "src": "/static/(.*)",
      "headers": {
        "cache-control": "public, max-age=31536000, immutable"
      }
    },
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ],
  "headers": [
    {
      "source": "/(.*)",
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
        }
      ]
    }
  ]
}
```

### 4. Traditional Web Hosting

For shared hosting or VPS deployment.

#### Build and Upload

```bash
# Build the application
npm run build

# The build folder contains all files needed for deployment
# Upload contents of 'build' folder to your web server's public directory

# Required files:
# - index.html (main entry point)
# - static/ (CSS, JS, and media files)
# - manifest.json
# - robots.txt
# - favicon.ico
```

#### Apache Configuration

**File**: `.htaccess` (place in build directory)
```apache
Options -MultiViews
RewriteEngine On

# Handle React Router
RewriteCond %{REQUEST_FILENAME} !-f
RewriteRule ^ index.html [QSA,L]

# Security headers
Header always set X-Content-Type-Options nosniff
Header always set X-Frame-Options DENY
Header always set X-XSS-Protection "1; mode=block"
Header always set Strict-Transport-Security "max-age=31536000; includeSubDomains"

# Cache static assets
<filesMatch "\.(css|js|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$">
  ExpiresActive on
  ExpiresDefault "access plus 1 year"
  Header set Cache-Control "public, immutable"
</filesMatch>
```

#### Nginx Configuration

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name your-domain.com;

    # Redirect to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name your-domain.com;

    # SSL configuration
    ssl_certificate /path/to/your/certificate.crt;
    ssl_certificate_key /path/to/your/private.key;

    # Security headers
    add_header X-Content-Type-Options nosniff;
    add_header X-Frame-Options DENY;
    add_header X-XSS-Protection "1; mode=block";
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains";

    # Root directory
    root /var/www/glownexa/build;
    index index.html;

    # Handle React Router
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location /static/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Security
    location ~ /\. {
        deny all;
    }
}
```

## 🔧 Environment-Specific Configurations

### 1. Development Environment

```bash
# Local development setup
npm install
npm start

# Environment file (.env.local)
REACT_APP_FIREBASE_API_KEY=dev_firebase_key
REACT_APP_FIREBASE_AUTH_DOMAIN=dev-project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=dev-project-id
REACT_APP_GEMINI_API_KEY=dev_gemini_key
REACT_APP_CLOUDINARY_CLOUD_NAME=dev_cloudinary
```

### 2. Staging Environment

```bash
# Staging deployment
npm run build
# Deploy to staging environment

# Environment file (.env.staging)
REACT_APP_FIREBASE_API_KEY=staging_firebase_key
REACT_APP_FIREBASE_AUTH_DOMAIN=staging-project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=staging-project-id
REACT_APP_GEMINI_API_KEY=staging_gemini_key
REACT_APP_CLOUDINARY_CLOUD_NAME=staging_cloudinary
```

### 3. Production Environment

```bash
# Production deployment
npm run build
# Deploy to production

# Environment file (.env.production)
REACT_APP_FIREBASE_API_KEY=prod_firebase_key
REACT_APP_FIREBASE_AUTH_DOMAIN=prod-project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=prod-project-id
REACT_APP_GEMINI_API_KEY=prod_gemini_key
REACT_APP_CLOUDINARY_CLOUD_NAME=prod_cloudinary
```

## 📊 Performance Optimization

### 1. Build Optimization

**Package.json Scripts**:
```json
{
  "scripts": {
    "build": "react-scripts build",
    "build:analyze": "npm run build && npx webpack-bundle-analyzer build/static/js/*.js",
    "build:prod": "NODE_ENV=production npm run build",
    "predeploy": "npm run build",
    "deploy": "firebase deploy --only hosting"
  }
}
```

**Webpack Optimizations** (handled by Create React App):
- Tree shaking for unused code elimination
- Code splitting for optimal chunk sizes
- Compression and minification
- Image optimization

### 2. CDN Configuration

**Firebase Hosting CDN** (automatic):
- Global edge locations
- Automatic compression (gzip/brotli)
- HTTP/2 support
- Automatic SSL certificates

**Custom CDN Setup** (if using other hosting):
```javascript
// Configure CDN for static assets
const CDN_URL = 'https://cdn.your-domain.com';

// In build process, replace asset URLs
// This would be done in a custom build script
const replaceCDNPaths = (buildDir) => {
  const files = glob.sync(`${buildDir}/**/*.html`);
  files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    content = content.replace(/\/static\//g, `${CDN_URL}/static/`);
    fs.writeFileSync(file, content);
  });
};
```

### 3. Caching Strategy

**Cache Headers Configuration**:
```json
{
  "hosting": {
    "headers": [
      {
        "source": "/static/**",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "public, max-age=31536000, immutable"
          }
        ]
      },
      {
        "source": "/index.html",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "no-cache, no-store, must-revalidate"
          }
        ]
      }
    ]
  }
}
```

## 🔍 Monitoring and Analytics

### 1. Performance Monitoring

**Web Vitals Tracking**:
```javascript
// reportWebVitals.js (already implemented)
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

function sendToAnalytics(metric) {
  // Send to your analytics service
  console.log(metric);
  
  // Example: Send to Google Analytics
  if (window.gtag) {
    window.gtag('event', metric.name, {
      event_category: 'Web Vitals',
      event_label: metric.id,
      value: Math.round(metric.value),
      non_interaction: true,
    });
  }
}

getCLS(sendToAnalytics);
getFID(sendToAnalytics);
getFCP(sendToAnalytics);
getLCP(sendToAnalytics);
getTTFB(sendToAnalytics);
```

**Firebase Performance Monitoring**:
```bash
# Install Firebase Performance
npm install firebase

# Add to firebase.js
import { getPerformance } from 'firebase/performance';

const perf = getPerformance(app);
```

### 2. Error Monitoring

**Error Boundary Implementation**:
```javascript
// ErrorBoundary.js
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Application error:', error, errorInfo);
    
    // Send to error monitoring service
    if (window.Sentry) {
      window.Sentry.captureException(error, {
        contexts: {
          react: {
            componentStack: errorInfo.componentStack
          }
        }
      });
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">
              Something went wrong
            </h1>
            <p className="text-gray-600 mb-6">
              We're sorry for the inconvenience. Please try refreshing the page.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
```

### 3. Analytics Setup

**Google Analytics 4**:
```html
<!-- Add to public/index.html -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

**Custom Analytics Events**:
```javascript
// analytics.js
export const trackEvent = (eventName, parameters = {}) => {
  if (window.gtag) {
    window.gtag('event', eventName, parameters);
  }
  
  console.log('Analytics Event:', eventName, parameters);
};

// Usage in components
export const trackSkinAnalysis = (analysisData) => {
  trackEvent('skin_analysis_completed', {
    skin_type: analysisData.skinType,
    user_age: analysisData.age,
    user_gender: analysisData.gender
  });
};

export const trackHairAnalysis = (analysisData) => {
  trackEvent('hair_analysis_completed', {
    hair_type: analysisData.hairType,
    user_age: analysisData.age,
    user_gender: analysisData.gender
  });
};
```

## 🚨 Troubleshooting Common Issues

### 1. Build Issues

**Memory Issues**:
```bash
# Increase Node.js memory limit
export NODE_OPTIONS="--max-old-space-size=4096"
npm run build
```

**Environment Variable Issues**:
```bash
# Verify environment variables are loaded
npm run build 2>&1 | grep REACT_APP_

# Check for typos in variable names
# Ensure all variables start with REACT_APP_
```

### 2. Deployment Issues

**Firebase Deployment Errors**:
```bash
# Clear Firebase cache
firebase logout
firebase login
firebase use your-project-id

# Reinstall Firebase CLI
npm uninstall -g firebase-tools
npm install -g firebase-tools@latest
```

**Routing Issues in Production**:
- Ensure hosting service supports SPA routing
- Check redirects/rewrites configuration
- Verify index.html is served for all routes

### 3. Performance Issues

**Large Bundle Size**:
```bash
# Analyze bundle composition
npm install -g webpack-bundle-analyzer
npx webpack-bundle-analyzer build/static/js/*.js
```

**Slow Loading**:
- Check CDN configuration
- Verify cache headers
- Optimize images and assets
- Enable compression (gzip/brotli)

## 📅 Maintenance Schedule

### 1. Regular Maintenance Tasks

**Daily**:
- Monitor application performance
- Check error logs
- Verify service availability

**Weekly**:
- Review analytics data
- Check security alerts
- Update dependencies
- Performance monitoring review

**Monthly**:
- Security audit
- Backup verification
- Capacity planning review
- User feedback analysis

**Quarterly**:
- Major dependency updates
- Security penetration testing
- Disaster recovery testing
- Performance optimization review

### 2. Update Procedures

**Dependency Updates**:
```bash
# Check for outdated packages
npm outdated

# Update non-breaking changes
npm update

# Update major versions (test thoroughly)
npm install package@latest

# Security updates
npm audit fix
```

**Environment Updates**:
```bash
# Update Node.js version
nvm install node
nvm use node

# Update Firebase CLI
npm install -g firebase-tools@latest

# Update deployment tools
npm install -g vercel@latest
npm install -g netlify-cli@latest
```

## 🎯 Launch Checklist

### Pre-Launch Final Verification

**✅ Technical Checklist**:
- [ ] Production build successful (204.99 kB main.js)
- [ ] All environment variables configured
- [ ] Firebase services connected and tested
- [ ] Cloudinary uploads working
- [ ] Gemini AI analysis functional
- [ ] Security rules deployed and tested
- [ ] HTTPS certificate configured
- [ ] Custom domain pointing correctly (if applicable)
- [ ] Analytics tracking implemented
- [ ] Error monitoring active
- [ ] Performance metrics baseline established

**✅ Functional Testing**:
- [ ] User registration and email verification
- [ ] Login and logout functionality
- [ ] Skin analysis complete workflow
- [ ] Hair analysis complete workflow
- [ ] Image upload and processing
- [ ] Analysis history display
- [ ] Responsive design on all devices
- [ ] Cross-browser compatibility tested

**✅ Security Verification**:
- [ ] User data isolation verified
- [ ] Authentication protection tested
- [ ] Input validation working
- [ ] Image upload restrictions enforced
- [ ] API rate limiting functional
- [ ] Security headers configured

**🚀 Go Live**:
```bash
# Final production deployment
npm run build
firebase deploy --only hosting
# Or your chosen deployment method

# Verify deployment
curl -I https://your-domain.com
# Check response headers and status codes

# Monitor initial traffic
# Watch error logs
# Track performance metrics
```

**🎉 Post-Launch**:
- Monitor application performance for first 24 hours
- Set up alerting for errors and downtime
- Prepare support documentation for users
- Plan first maintenance window

---

**Congratulations! Your Glownexa application is now live and ready to help users with AI-powered skin and hair analysis.** 🌟
