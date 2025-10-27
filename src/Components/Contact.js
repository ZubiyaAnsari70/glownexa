import React, { useState } from 'react';
import { Send, MapPin, Phone, Mail, Clock, CheckCircle, Sparkles, MessageCircle } from 'lucide-react';

const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState(null);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const validate = () => {
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) return false;
    const re = /\S+@\S+\.\S+/;
    return re.test(form.email);
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!validate()) {
      setStatus({ type: 'error', message: 'Please fill name, valid email and message.' });
      return;
    }

    setSending(true);
    setStatus(null);

    try {
      const endpoint = process.env.REACT_APP_CONTACT_ENDPOINT || '/api/contact';
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: form.name, email: form.email, subject: form.subject, message: form.message })
      });

      const json = await res.json();
      if (res.ok && json.success) {
        setStatus({ type: 'success', message: 'Message sent successfully. We will get back to you soon.' });
        setForm({ name: '', email: '', subject: '', message: '' });
      } else {
        setStatus({ type: 'error', message: json.error || 'Failed to send message' });
      }
    } catch (err) {
      console.error('Contact POST error:', err);
      setStatus({ type: 'error', message: 'Failed to send message. Please try again later.' });
    } finally {
      setSending(false);
    }
  };

  const contactInfo = [
    {
      icon: MapPin,
      title: 'Address',
      details: ['123 Anywhere St. Any', 'City, ST 12345'],
      color: 'from-amber-100 to-orange-100',
      iconColor: 'text-amber-700'
    },
    {
      icon: Phone,
      title: 'Phone',
      details: ['+123-456-7890'],
      color: 'from-orange-100 to-yellow-100',
      iconColor: 'text-orange-700'
    },
    {
      icon: Mail,
      title: 'Email',
      details: ['hello@reallygreasite.com'],
      color: 'from-yellow-100 to-amber-100',
      iconColor: 'text-yellow-700'
    },
    {
      icon: Clock,
      title: 'Working Hours',
      details: ['Mon - Fri: 9:00 AM - 6:00 PM', 'Sat: 10:00 AM - 4:00 PM'],
      color: 'from-amber-100 to-orange-100',
      iconColor: 'text-amber-700'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
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
          0%, 100% { box-shadow: 0 0 20px rgba(217, 119, 6, 0.3); }
          50% { box-shadow: 0 0 40px rgba(217, 119, 6, 0.6); }
        }
        .float { animation: float 3s ease-in-out infinite; }
        .fade-in-up { animation: fadeInUp 0.8s ease-out; }
        .slide-in-left { animation: slideInLeft 0.8s ease-out; }
        .slide-in-right { animation: slideInRight 0.8s ease-out; }
        .glow-box { animation: glow 2s ease-in-out infinite; }
      `}</style>

      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md shadow-sm border-b border-amber-100">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold bg-gradient-to-r from-amber-700 to-orange-700 bg-clip-text text-transparent flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-amber-700" />
            GlowNexa
          </div>
          <ul className="hidden md:flex gap-8 text-gray-700 font-medium">
            <li><a href="#home" className="hover:text-amber-700 transition-colors duration-300">Home</a></li>
            <li><a href="#about" className="hover:text-amber-700 transition-colors duration-300">About</a></li>
            <li><a href="#contact" className="hover:text-amber-700 transition-colors duration-300">Contact</a></li>
          </ul>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative py-24 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-amber-100/50 via-orange-100/50 to-yellow-100/50"></div>
        <div className="max-w-6xl mx-auto relative z-10 text-center">
          <div className="fade-in-up">
            <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-amber-700 via-orange-700 to-yellow-700 bg-clip-text text-transparent leading-tight">
              Get In Touch
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
            </p>
          </div>
          <div className="mt-8 flex justify-center gap-4">
            <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></div>
            <div className="w-2 h-2 rounded-full bg-orange-400 animate-pulse delay-100"></div>
            <div className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse delay-200"></div>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        
        {/* Contact Info Cards */}
        <div className="mb-12">
          <div className="fade-in-up flex items-center gap-3 mb-8">
            <div className="w-1 h-8 bg-gradient-to-b from-amber-700 to-orange-700"></div>
            <h2 className="text-4xl font-bold text-gray-800">Contact Information</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactInfo.map((info, idx) => {
              const Icon = info.icon;
              return (
                <div
                  key={idx}
                  className="fade-in-up bg-white/60 backdrop-blur p-6 rounded-2xl border border-amber-100/50 hover:border-amber-300 hover:shadow-xl hover:-translate-y-2 transition-all duration-500 group"
                  style={{ animationDelay: `${idx * 0.1}s` }}
                >
                  <div className={`w-14 h-14 bg-gradient-to-br ${info.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className={`${info.iconColor} w-7 h-7`} />
                  </div>
                  <h3 className="font-bold text-gray-800 mb-3 text-lg">{info.title}</h3>
                  {info.details.map((detail, i) => (
                    <p key={i} className="text-gray-600 text-sm leading-relaxed">{detail}</p>
                  ))}
                </div>
              );
            })}
          </div>
        </div>

        {/* Contact Form Section */}
        <div className="fade-in-up bg-white/60 backdrop-blur rounded-2xl shadow-lg p-12 mb-12 border border-amber-100/50 hover:shadow-2xl transition-shadow duration-500">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-1 h-8 bg-gradient-to-b from-amber-700 to-orange-700"></div>
            <h2 className="text-4xl font-bold text-gray-800">Send Us a Message</h2>
          </div>

          {status && (
            <div className={`mb-6 p-4 rounded-lg flex items-start space-x-3 fade-in-up ${
              status.type === 'error' 
                ? 'bg-red-50 border border-red-200' 
                : 'bg-green-50 border border-green-200'
            }`}>
              {status.type === 'success' && <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />}
              <span className={status.type === 'error' ? 'text-red-700' : 'text-green-700'}>
                {status.message}
              </span>
            </div>
          )}

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="slide-in-left">
                <label className="block text-gray-700 font-semibold mb-2">Name *</label>
                <input
                  name="name"
                  value={form.name}
                  onChange={onChange}
                  placeholder="Your name"
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-100 outline-none transition-all duration-300 bg-white/50"
                />
              </div>
              <div className="slide-in-right">
                <label className="block text-gray-700 font-semibold mb-2">Email *</label>
                <input
                  name="email"
                  value={form.email}
                  onChange={onChange}
                  placeholder="Your email"
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100 outline-none transition-all duration-300 bg-white/50"
                />
              </div>
            </div>

            <div className="fade-in-up" style={{animationDelay: '0.2s'}}>
              <label className="block text-gray-700 font-semibold mb-2">Subject</label>
              <input
                name="subject"
                value={form.subject}
                onChange={onChange}
                placeholder="Subject (optional)"
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100 outline-none transition-all duration-300 bg-white/50"
              />
            </div>

            <div className="fade-in-up" style={{animationDelay: '0.3s'}}>
              <label className="block text-gray-700 font-semibold mb-2">Message *</label>
              <textarea
                name="message"
                value={form.message}
                onChange={onChange}
                placeholder="Write your message here..."
                rows={6}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100 outline-none transition-all duration-300 resize-none bg-white/50"
              />
            </div>

            <div className="fade-in-up" style={{animationDelay: '0.4s'}}>
              <button
                onClick={handleSend}
                disabled={sending}
                className="w-full md:w-auto bg-gradient-to-r from-amber-700 via-orange-700 to-yellow-700 text-white px-10 py-4 rounded-xl font-bold hover:scale-105 hover:shadow-2xl transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {sending ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    <span>Send Message</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Why Contact Us Section */}
        <div className="fade-in-up bg-gradient-to-br from-amber-50/80 to-orange-50/80 backdrop-blur p-12 rounded-2xl border border-amber-200/50 hover:border-amber-400 hover:shadow-lg transition-all duration-500 mb-12">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-amber-600 to-orange-600 rounded-full flex-shrink-0 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <MessageCircle className="text-white w-8 h-8" />
            </div>
            <div>
              <h3 className="font-bold text-gray-800 mb-4 text-2xl">We're Here to Help</h3>
              <p className="text-gray-700 leading-relaxed text-lg mb-4">
                Whether you have questions about our AI-powered skin and hair analysis, need technical support, or want to learn more about our services, our team is ready to assist you.
              </p>
              <p className="text-gray-700 leading-relaxed text-lg">
                We typically respond within 24 hours during business days. For urgent matters, please call us directly.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white/60 backdrop-blur border-t border-amber-100/50 text-gray-700 py-16 relative overflow-hidden mt-12">
        <div className="absolute inset-0 opacity-6">
          <div className="absolute top-10 left-10 w-40 h-40 bg-amber-200 rounded-full float blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-32 h-32 bg-orange-200 rounded-full float blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2 slide-in-left">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-amber-700 to-orange-700 rounded-full flex items-center justify-center hover:scale-110 transition-all duration-300">
                  <span className="text-white font-bold text-xl">G</span>
                </div>
                <h3 className="text-2xl font-bold">GlowNexa</h3>
              </div>
              <p className="text-gray-600 text-lg leading-relaxed mb-6 max-w-md fade-in-up">
                Revolutionizing skin and hair care with AI-powered analysis and personalized treatment recommendations.
              </p>
              <div className="flex gap-4">
                <div className="w-10 h-10 bg-white/60 rounded-full flex items-center justify-center border border-amber-100 hover:bg-amber-50 transition-all duration-300 cursor-pointer hover:scale-110">
                  <span className="text-sm">📧</span>
                </div>
                <div className="w-10 h-10 bg-white/60 rounded-full flex items-center justify-center border border-amber-100 hover:bg-orange-50 transition-all duration-300 cursor-pointer hover:scale-110">
                  <span className="text-sm">📱</span>
                </div>
                <div className="w-10 h-10 bg-white/60 rounded-full flex items-center justify-center border border-amber-100 hover:bg-yellow-50 transition-all duration-300 cursor-pointer hover:scale-110">
                  <span className="text-sm">🌐</span>
                </div>
              </div>
            </div>

            <div className="fade-in-up" style={{animationDelay: '0.2s'}}>
              <h4 className="text-lg font-semibold mb-4 text-amber-700">Services</h4>
              <ul className="space-y-2 text-gray-600">
                <li className="hover:text-amber-800 transition-all duration-300 cursor-pointer hover:translate-x-2">Skin Analysis</li>
                <li className="hover:text-amber-800 transition-all duration-300 cursor-pointer hover:translate-x-2">Hair Analysis</li>
                <li className="hover:text-amber-800 transition-all duration-300 cursor-pointer hover:translate-x-2">Treatment Plans</li>
                <li className="hover:text-amber-800 transition-all duration-300 cursor-pointer hover:translate-x-2">Product Recommendations</li>
              </ul>
            </div>

            <div className="fade-in-up" style={{animationDelay: '0.4s'}}>
              <h4 className="text-lg font-semibold mb-4 text-orange-700">Support</h4>
              <ul className="space-y-2 text-gray-600">
                <li className="hover:text-amber-800 transition-all duration-300 cursor-pointer hover:translate-x-2">Help Center</li>
                <li className="hover:text-amber-800 transition-all duration-300 cursor-pointer hover:translate-x-2">Contact Us</li>
                <li className="hover:text-amber-800 transition-all duration-300 cursor-pointer hover:translate-x-2">Privacy Policy</li>
                <li className="hover:text-amber-800 transition-all duration-300 cursor-pointer hover:translate-x-2">Terms of Service</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-amber-100 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center fade-in-up">
            <p className="text-gray-600 text-sm">
              © 2025 GlowNexa. All rights reserved.
            </p>
            <p className="text-gray-600 text-sm mt-4 md:mt-0">
              Made with ❤️ for healthier skin and hair
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Contact;