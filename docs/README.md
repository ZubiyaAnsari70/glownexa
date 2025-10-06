# Glownexa - AI-Powered Skin & Hair Analysis Platform

Glownexa is a comprehensive web application that provides AI-powered analysis for both skin and hair conditions using advanced machine learning and computer vision technologies.

## 🌟 Features

- **Dual Analysis System**: Separate analysis for skin and hair conditions
- **AI-Powered Insights**: Uses Google's Gemini AI for detailed analysis
- **Cloud Storage**: Secure image storage with Cloudinary
- **User Authentication**: Firebase-based authentication system
- **Analysis History**: Complete history tracking for all analyses
- **Responsive Design**: Works seamlessly across all devices
- **Real-time Processing**: Live analysis with progress indicators

## 🛠 Technology Stack

### Frontend
- **React.js 19.1.0** - Modern UI framework
- **Tailwind CSS** - Utility-first styling
- **Lucide Icons** - Beautiful, consistent icons
- **React Router** - Client-side routing

### Backend Services
- **Firebase Authentication** - User management
- **Firebase Firestore** - NoSQL database
- **Google Gemini AI** - AI analysis engine
- **Cloudinary** - Image storage and optimization

### Development Tools
- **Create React App** - Development environment
- **ESLint** - Code quality
- **Node.js** - Runtime environment

## 📊 Application Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   React Frontend │    │  Firebase Auth   │    │  Firestore DB   │
│                 │────│                  │────│                 │
│ • Skin Analysis │    │ • Login/Register │    │ • User Data     │
│ • Hair Analysis │    │ • Email Verify   │    │ • Analysis Data │
│ • History View  │    │ • Protected Routes│    │ • Timestamps    │
└─────────────────┘    └──────────────────┘    └─────────────────┘
         │                                               │
         ▼                                               ▼
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Cloudinary    │    │   Gemini AI      │    │  Security Rules │
│                 │    │                  │    │                 │
│ • Image Upload  │    │ • Image Analysis │    │ • User Isolation│
│ • Optimization  │    │ • Text Generation│    │ • Data Privacy  │
│ • CDN Delivery  │    │ • Vision AI      │    │ • Access Control│
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

## 📁 Project Structure

```
glownexa/
├── public/                 # Static assets
├── src/
│   ├── Components/        # React components
│   │   ├── firebase.js    # Firebase configuration
│   │   ├── firestoreService.js # Database operations
│   │   ├── cloudinary.js  # Image upload service
│   │   ├── skinScan.js    # Skin analysis component
│   │   ├── hairScan.js    # Hair analysis component
│   │   ├── History.js     # Analysis history
│   │   ├── Login.js       # Authentication
│   │   ├── register.js    # User registration
│   │   └── ...
│   ├── App.js             # Main application
│   └── index.js           # Entry point
├── docs/                  # Documentation
├── build/                 # Production build
├── .env                   # Environment variables
└── package.json           # Dependencies
```

## 🚀 Quick Start

1. **Clone Repository**
   ```bash
   git clone https://github.com/ZubiyaAnsari70/glownexa.git
   cd glownexa
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   - Copy `.env.example` to `.env`
   - Add your API keys and configurations

4. **Development Server**
   ```bash
   npm start
   ```

5. **Production Build**
   ```bash
   npm run build
   ```

## 📖 Documentation

- [Firebase Setup & Authentication](./firebase-setup.md)
- [Cloudinary Integration](./cloudinary-integration.md)
- [Gemini AI Configuration](./gemini-ai-setup.md)
- [Skin Analysis System](./skin-analysis.md)
- [Hair Analysis System](./hair-analysis.md)
- [Data Management & Firestore](./data-management.md)
- [Security & Firestore Rules](./security-rules.md)
- [Deployment Guide](./deployment.md)

## 🔒 Security Features

- **User Authentication**: Firebase Auth with email verification
- **Data Isolation**: User-specific data access
- **Secure Rules**: Firestore security rules
- **API Protection**: Environment variable management
- **Image Security**: Cloudinary secure uploads

## 🎯 Key Features Explained

### Analysis Pipeline
1. **User Upload** → Image selection and validation
2. **Cloud Storage** → Secure upload to Cloudinary
3. **AI Processing** → Gemini AI analysis
4. **Data Storage** → Results saved to Firestore
5. **History Display** → Unified history view

### Data Flow
```
User → Upload → Cloudinary → AI Analysis → Firestore → History
```

## 📱 Responsive Design

- **Mobile First**: Optimized for mobile devices
- **Tablet Support**: Adaptive layouts
- **Desktop Enhanced**: Full-featured experience
- **Progressive Web App**: PWA capabilities

## 🔧 Maintenance

- **Regular Updates**: Keep dependencies updated
- **Performance Monitoring**: Track app performance
- **Error Logging**: Monitor and fix issues
- **User Feedback**: Continuous improvement

## 📞 Support

For issues and questions:
- Create an issue on GitHub
- Check documentation files
- Review error logs
- Contact development team

---

**Built with ❤️ by the Glownexa Team**
