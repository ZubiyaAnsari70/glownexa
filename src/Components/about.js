import React, { useState, useEffect } from 'react';
import { Zap, Smartphone, Microscope, ArrowRight, Sparkles } from 'lucide-react';

export default function About() {
  const [scrollY, setScrollY] = useState(0);
  const [visibleSections, setVisibleSections] = useState({});

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const features = [
    {
      icon: Microscope,
      title: 'Advanced AI Technology',
      description: 'Our machine learning models are trained on thousands of medical images to provide accurate and reliable diagnostics.'
    },
    {
      icon: Zap,
      title: 'Instant Results',
      description: 'Get preliminary diagnosis and recommendations in seconds, not days. Save time without compromising accuracy.'
    },
   
    {
      icon: Smartphone,
      title: 'User-Friendly',
      description: 'Simple, intuitive interface designed for everyone. No medical knowledge required to get started.'
    }
  ];

  const values = [
    {
      title: 'Accuracy',
      description: 'We\'re committed to providing the most accurate diagnostics through continuous improvement and validation.'
    },
    {
      title: 'Accessibility',
      description: 'Healthcare should be accessible to everyone, everywhere. We break down barriers to professional diagnosis.'
    },
    {
      title: 'Compassion',
      description: 'We understand that skin and hair conditions can be emotionally challenging. We treat every user with care and empathy.'
    },
    {
      title: 'Transparency',
      description: 'We clearly communicate how our AI works and what the limitations are. No false promises, just honest insights.'
    }
  ];

 
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-teal-50 to-cyan-50">
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes glow {
          0%, 100% { box-shadow: 0 0 20px rgba(6, 182, 212, 0.3); }
          50% { box-shadow: 0 0 40px rgba(6, 182, 212, 0.6); }
        }
        .float { animation: float 3s ease-in-out infinite; }
        .fade-in-up { animation: fadeInUp 0.8s ease-out; }
        .slide-in-left { animation: slideInLeft 0.8s ease-out; }
        .slide-in-right { animation: slideInRight 0.8s ease-out; }
        .glow-box { animation: glow 2s ease-in-out infinite; }
      `}</style>

      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md shadow-sm border-b border-cyan-100">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold bg-gradient-to-r from-cyan-600 to-teal-600 bg-clip-text text-transparent flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-cyan-600" />
            GlowNexa
          </div>
          <ul className="hidden md:flex gap-8 text-gray-700 font-medium">
            <li><a href="#home" className="hover:text-cyan-600 transition-colors duration-300">Home</a></li>
            <li><a href="#about" className="hover:text-cyan-600 transition-colors duration-300">About</a></li>

            <li><a href="#contact" className="hover:text-cyan-600 transition-colors duration-300">Contact</a></li>
          </ul>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative py-24 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-100/50 via-teal-100/50 to-blue-100/50"></div>
        <div className="max-w-6xl mx-auto relative z-10 text-center">
          <div className="fade-in-up">
            <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-cyan-600 via-teal-600 to-blue-600 bg-clip-text text-transparent leading-tight">
              About GlowNexa
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Revolutionizing Skin & Hair Health Through Advanced Disease Detection Technology
            </p>
          </div>
          <div className="mt-8 flex justify-center gap-4">
            <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></div>
            <div className="w-2 h-2 rounded-full bg-teal-400 animate-pulse delay-100"></div>
            <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse delay-200"></div>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        
        {/* Mission Section */}
        <div className="fade-in-up bg-white/60 backdrop-blur rounded-2xl shadow-lg p-12 mb-12 border border-cyan-100/50 hover:shadow-2xl transition-shadow duration-500">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1 h-8 bg-gradient-to-b from-cyan-600 to-teal-600"></div>
            <h2 className="text-4xl font-bold text-gray-800">Our Mission</h2>
          </div>
          <p className="text-gray-700 mb-6 text-lg leading-relaxed">
            At GlowNexa, we're on a mission to make professional-grade skin and hair disease detection accessible to everyone. We believe that early detection and accurate diagnosis are the foundation of effective treatment. By harnessing the power of artificial intelligence and medical expertise, we're transforming how people identify and manage dermatological and trichological conditions.
          </p>
          <p className="text-gray-700 text-lg leading-relaxed">
            Our platform empowers individuals to take control of their skin and hair health with confidence, providing reliable, fast, and compassionate care from the comfort of their homes.
          </p>
        </div>

        {/* Features Section */}
        <div className="mb-12">
          <div className="fade-in-up flex items-center gap-3 mb-8">
            <div className="w-1 h-8 bg-gradient-to-b from-cyan-600 to-teal-600"></div>
            <h2 className="text-4xl font-bold text-gray-800">Why GlowNexa?</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {features.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <div
                  key={idx}
                  className="fade-in-up bg-white/60 backdrop-blur p-8 rounded-2xl border border-cyan-100/50 hover:border-cyan-300 hover:shadow-xl hover:-translate-y-2 transition-all duration-500 group"
                  style={{ animationDelay: `${idx * 0.1}s` }}
                >
                  <div className="w-14 h-14 bg-gradient-to-br from-cyan-100 to-teal-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Icon className="text-cyan-600 w-7 h-7" />
                  </div>
                  <h3 className="font-bold text-gray-800 mb-3 text-lg">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Values Section */}
        <div className="mb-12">
          <div className="fade-in-up flex items-center gap-3 mb-8">
            <div className="w-1 h-8 bg-gradient-to-b from-cyan-600 to-teal-600"></div>
            <h2 className="text-4xl font-bold text-gray-800">Our Core Values</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {values.map((value, idx) => (
              <div
                key={idx}
                className="fade-in-up bg-gradient-to-br from-cyan-50/80 to-teal-50/80 backdrop-blur p-8 rounded-2xl border border-cyan-200/50 hover:border-cyan-400 hover:shadow-lg transition-all duration-500 group"
                style={{ animationDelay: `${idx * 0.15}s` }}
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-teal-500 rounded-full flex-shrink-0 flex items-center justify-center mt-1 group-hover:scale-110 transition-transform duration-300">
                    <Sparkles className="text-white w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800 mb-2 text-lg">{value.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{value.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

       

        {/* Journey Section */}
        <div className="fade-in-up bg-white/60 backdrop-blur rounded-2xl shadow-lg p-12 mb-12 border border-cyan-100/50 hover:shadow-2xl transition-shadow duration-500">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1 h-8 bg-gradient-to-b from-cyan-600 to-teal-600"></div>
            <h2 className="text-4xl font-bold text-gray-800">Our Journey</h2>
          </div>
          <p className="text-gray-700 mb-6 text-lg leading-relaxed">
            GlowNexa was founded in 2023 by a team of healthcare professionals and technologists who recognized a gap in accessible dermatological care. What started as a passion project has evolved into a comprehensive platform used by thousands of people worldwide.
          </p>
          <p className="text-gray-700 text-lg leading-relaxed">
            Today, we continue to innovate, expand our diagnostic capabilities, and partner with medical institutions to ensure our technology remains at the forefront of dermatological AI. Our commitment is to make quality healthcare more accessible, affordable, and empowering for everyone.
          </p>
        </div>

        {/* CTA Section */}
        <div className="fade-in-up relative overflow-hidden rounded-2xl shadow-2xl p-12 text-center mb-12 glow-box">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-teal-500 to-blue-500"></div>
          <div className="relative z-10">
            <h2 className="text-4xl font-bold text-white mb-4">Ready to Transform Your Skin & Hair Health?</h2>
            <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">Join thousands of users who trust GlowNexa for their dermatological needs.</p>
            <button className="bg-white text-cyan-600 px-10 py-4 rounded-xl font-bold hover:scale-105 hover:shadow-2xl transition-all duration-300 flex items-center justify-center gap-2 mx-auto hover:gap-3">
              Get Started Today
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white/60 backdrop-blur border-t border-cyan-100/50 text-gray-700 text-center py-8 mt-12">
        <p className="font-medium">&copy; 2025 GlowNexa. All rights reserved. | Privacy Policy | Terms of Service | Contact Us</p>
      </footer>
    </div>
  );
}