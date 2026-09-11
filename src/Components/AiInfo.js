import React, { useEffect, useState } from 'react';
import { BrainCircuit, Image, Layers3, Activity, AlertTriangle, ShieldCheck, BookOpen, Mail, Circle, Zap, Database, Eye } from 'lucide-react';
import { Link } from "react-router-dom";
const AiInfo = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    setIsLoaded(true);
    const interval = setInterval(() => {
      setActiveStep(prev => (prev + 1) % 3);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-sky-50 to-teal-50 relative overflow-hidden">

      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(6,182,212,0.08),transparent_50%)]"></div>
        <div className="absolute top-20 left-10 w-64 h-64 bg-cyan-300/30 rounded-full blur-3xl animate-float"></div>
        <div className="absolute top-40 right-20 w-80 h-80 bg-teal-300/30 rounded-full blur-3xl animate-float-reverse"></div>
        <div className="absolute bottom-20 left-32 w-72 h-72 bg-sky-300/30 rounded-full blur-3xl animate-float-slow"></div>

        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.03)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
      </div>

      {/* Hero Section */}
      <div className={`relative z-10 pt-12 pb-8 px-4 transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'}`}>
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center space-x-3 mb-4 bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full border border-cyan-200 shadow-lg">
            <BrainCircuit className="h-8 w-8 text-cyan-600" />
            <span className="text-cyan-700 font-semibold text-lg">AI-Powered Analysis</span>
          </div>
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-slate-800 mb-6 tracking-tight">
            GlowNexa <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-teal-600">Intelligence</span>
          </h1>
          <p className="text-xl text-slate-700 max-w-3xl mx-auto leading-relaxed">
            Advanced dermatological AI trained on diverse datasets, delivering preliminary insights into skin and hair conditions through deep learning technology.
          </p>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 pb-16 space-y-8">

        {/* AI Process Flow - Full Width */}
        <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-8 border border-slate-200 shadow-xl">
          <div className="flex items-center space-x-3 mb-8">
            <Layers3 className="h-7 w-7 text-cyan-600" />
            <h2 className="text-3xl font-bold text-slate-800">AI Processing Pipeline</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
            {/* Connection Lines */}
            <div className="hidden md:block absolute top-1/2 left-1/3 right-1/3 h-0.5 bg-gradient-to-r from-cyan-400 via-teal-400 to-sky-400 transform -translate-y-1/2"></div>

            {/* Step 1 */}
            <div className={`relative bg-gradient-to-br from-cyan-100 to-cyan-50 p-6 rounded-2xl border-2 transition-all duration-500 ${activeStep === 0 ? 'border-cyan-500 shadow-xl shadow-cyan-200/50 scale-105' : 'border-cyan-200'}`}>
              <div className="absolute -top-4 -left-4 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-full p-3 shadow-xl">
                <Image className="h-6 w-6 text-white" />
              </div>
              <div className="mt-4">
                <h3 className="text-2xl font-bold text-slate-800 mb-3">Image Processing</h3>
                <p className="text-slate-700 leading-relaxed">High-resolution image normalization with advanced preprocessing algorithms to enhance critical visual features and patterns.</p>
              </div>
              <div className="mt-4 flex items-center space-x-2">
                <Zap className="h-4 w-4 text-cyan-600" />
                <span className="text-cyan-700 text-sm font-medium">Real-time Analysis</span>
              </div>
            </div>

            {/* Step 2 */}
            <div className={`relative bg-gradient-to-br from-teal-100 to-teal-50 p-6 rounded-2xl border-2 transition-all duration-500 ${activeStep === 1 ? 'border-teal-500 shadow-xl shadow-teal-200/50 scale-105' : 'border-teal-200'}`}>
              <div className="absolute -top-4 -left-4 bg-gradient-to-br from-teal-500 to-teal-600 rounded-full p-3 shadow-xl">
                <Activity className="h-6 w-6 text-white" />
              </div>
              <div className="mt-4">
                <h3 className="text-2xl font-bold text-slate-800 mb-3">Feature Extraction</h3>
                <p className="text-slate-700 leading-relaxed">Convolutional neural networks identify complex patterns, textures, color variations, and structural anomalies across skin layers.</p>
              </div>
              <div className="mt-4 flex items-center space-x-2">
                <Database className="h-4 w-4 text-teal-600" />
                <span className="text-teal-700 text-sm font-medium">Deep Learning</span>
              </div>
            </div>

            {/* Step 3 */}
            <div className={`relative bg-gradient-to-br from-sky-100 to-sky-50 p-6 rounded-2xl border-2 transition-all duration-500 ${activeStep === 2 ? 'border-sky-500 shadow-xl shadow-sky-200/50 scale-105' : 'border-sky-200'}`}>
              <div className="absolute -top-4 -left-4 bg-gradient-to-br from-sky-500 to-sky-600 rounded-full p-3 shadow-xl">
                <BrainCircuit className="h-6 w-6 text-white" />
              </div>
              <div className="mt-4">
                <h3 className="text-2xl font-bold text-slate-800 mb-3">AI Analysis</h3>
                <p className="text-slate-700 leading-relaxed">Powered by Google Gemini AI to analyze patterns and provide intelligent insights with detailed condition assessments and recommendations.</p>
              </div>
              <div className="mt-4 flex items-center space-x-2">
                <Eye className="h-4 w-4 text-sky-600" />
                <span className="text-sky-700 text-sm font-medium">Gemini AI Powered</span>
              </div>
            </div>
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* Left Column - Warning */}
          <div className="bg-gradient-to-br from-yellow-50 to-orange-50 backdrop-blur-xl rounded-3xl p-8 border border-yellow-300 shadow-xl">
            <div className="flex items-start space-x-4 mb-4">
              <div className="bg-yellow-200 rounded-full p-3">
                <AlertTriangle className="h-6 w-6 text-yellow-700" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-800 mb-2">Critical Limitations</h2>
                <div className="h-1 w-20 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full"></div>
              </div>
            </div>

            <div className="space-y-4 text-slate-700">
              <p className="leading-relaxed">
                AI accuracy varies significantly based on <strong className="text-yellow-700">image quality, lighting conditions, and camera angle</strong>. Results are probabilistic estimates, not diagnoses.
              </p>
              <p className="leading-relaxed">
                Performance may be limited for <strong className="text-yellow-700">diverse skin tones, rare conditions, or atypical presentations</strong>. Cultural and regional variations in dermatological conditions require professional interpretation.
              </p>
              <div className="bg-yellow-100 rounded-xl p-4 mt-6 border border-yellow-300">
                <p className="text-slate-800 font-semibold text-lg">
                  ⚕️ Always consult qualified dermatologists or trichologists for definitive diagnosis and treatment plans.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column - Privacy */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 backdrop-blur-xl rounded-3xl p-8 border border-green-300 shadow-xl">
            <div className="flex items-start space-x-4 mb-4">
              <div className="bg-green-200 rounded-full p-3">
                <ShieldCheck className="h-6 w-6 text-green-700" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-800 mb-2">Privacy & Security</h2>
                <div className="h-1 w-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"></div>
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-slate-700 leading-relaxed">
                Your data security is our highest priority. All uploaded images are processed using <strong className="text-green-700">end-to-end encryption</strong> and secure cloud infrastructure.
              </p>

              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="bg-green-200 rounded-lg p-2 mt-1">
                    <Circle className="h-4 w-4 text-green-700" />
                  </div>
                  <div>
                    <p className="text-slate-800 font-semibold">Secure Storage</p>
                    <p className="text-slate-600 text-sm">Images stored securely on Cloudinary with AES-based encryption</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="bg-green-200 rounded-lg p-2 mt-1">
                    <Circle className="h-4 w-4 text-green-700" />
                  </div>
                  <div>
                    <p className="text-slate-800 font-semibold">Data Control</p>
                    <p className="text-slate-600 text-sm">You can view or delete your history anytime</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="bg-green-200 rounded-lg p-2 mt-1">
                    <Circle className="h-4 w-4 text-green-700" />
                  </div>
                  <div>
                    <p className="text-slate-800 font-semibold">Privacy Assured</p>
                    <p className="text-slate-600 text-sm">No data shared with any third party</p>
                  </div>
                </div>

              </div>

              <Link
                to="/privacy-policy"
                className="inline-block text-green-700 hover:text-green-800 font-medium underline decoration-green-400 hover:decoration-green-500 transition-colors mt-2"
              >
                Read Complete Privacy Policy →
              </Link>
            </div>
          </div>
        </div>

        {/* Learn More CTA - Full Width */}
        <div className="bg-gradient-to-br from-cyan-50 to-teal-50 backdrop-blur-xl rounded-3xl p-8 border border-cyan-200 shadow-xl text-center">
          <BookOpen className="h-12 w-12 text-cyan-600 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-slate-800 mb-4">Explore Our Research</h2>
          <p className="text-slate-700 text-lg max-w-2xl mx-auto mb-8 leading-relaxed">
            Dive deep into the technology powering GlowNexa. Learn about our AI models,  validation studies, and ongoing research initiatives.
          </p>
          <a href="mailto:jubairmohd7827@gmail.com" className="inline-flex items-center space-x-3 bg-gradient-to-r from-cyan-500 to-teal-500 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:shadow-2xl hover:shadow-cyan-300/50 transition-all duration-300 transform hover:scale-105">
            <Mail className="h-5 w-5" />
            <span>Contact Our Research Team</span>
          </a>
        </div>

      </div>

      <style>{`
        @keyframes float { 
          0%, 100% { transform: translateY(0px) rotate(0deg); } 
          50% { transform: translateY(-30px) rotate(5deg); } 
        }
        @keyframes float-reverse { 
          0%, 100% { transform: translateY(0px) rotate(0deg); } 
          50% { transform: translateY(30px) rotate(-5deg); } 
        }
        @keyframes float-slow { 
          0%, 100% { transform: translateY(0px) scale(1); } 
          50% { transform: translateY(-20px) scale(1.1); } 
        }
        .animate-float { animation: float 8s ease-in-out infinite; }
        .animate-float-reverse { animation: float-reverse 10s ease-in-out infinite; }
        .animate-float-slow { animation: float-slow 12s ease-in-out infinite; }
      `}</style>
    </div>
  );
}

export default AiInfo;