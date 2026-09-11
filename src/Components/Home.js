import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { signOut } from 'firebase/auth';
import { auth } from './firebase';
import { Download, History, Sparkles } from 'lucide-react';

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showAnalysisPopup, setShowAnalysisPopup] = useState(false);
  const navigate = useNavigate();
  // Enhanced sliders with new color theme (Purple/Blue/Teal)
  const isAuthenticated = localStorage.getItem("isAuthenticated");

  const handleLogout = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem("isAuthenticated");
      navigate("/login");
    } catch (error) {
      console.error('Logout error:', error);
      // Even if Firebase logout fails, clear local state
      localStorage.removeItem("isAuthenticated");
      navigate("/login");
    }
  };


  const sliders = [
    {
      title: "AI-Powered Skin & Hair Analysis",
      text: "Upload a photo and get instant analysis of potential skin conditions and hair problems with AI-driven insights. Our advanced algorithms provide accurate assessments in seconds.",
      gradient: "from-rose-400 via-pink-300 to-purple-300",
      bgColor: "bg-gradient-to-br from-rose-50 to-pink-50",
      iconBg: "bg-gradient-to-r from-rose-500 to-pink-500",
      accentColor: "purple"
    },
    {
      title: "Personalized Care Solutions",
      text: "Get customized treatment recommendations, skincare routines, and product suggestions based on your specific condition and skin type. Tailored just for you.",
      gradient: "from-emerald-400 via-teal-300 to-cyan-300",
      bgColor: "bg-gradient-to-br from-emerald-50 to-teal-50",
      iconBg: "bg-gradient-to-r from-emerald-500 to-teal-500",
      accentColor: "blue"
    },
    {
      title: "Comprehensive Reports",
      text: "Detailed analysis with treatment suggestions and next steps. Get professional-grade insights with clear explanations and actionable recommendations for your skin and hair health.",
      gradient: "from-blue-400 via-indigo-300 to-purple-300",
      bgColor: "bg-gradient-to-br from-blue-50 to-indigo-50",
      iconBg: "bg-gradient-to-r from-blue-500 to-indigo-500",
      accentColor: "indigo"
    },
    {
      title: "Your Health Companion",
      text: "24/7 access to skin and hair health monitoring. Track your progress, set reminders, and maintain consistent care routines with our intelligent health companion.",
      gradient: "from-amber-400 via-orange-300 to-red-300",
      bgColor: "bg-gradient-to-br from-amber-50 to-orange-50",
      iconBg: "bg-gradient-to-r from-amber-500 to-orange-500",
      accentColor: "teal"
    },
  ];

  const scrollToSlide = (index) => {
    setCurrentSlide(index);
    const slider = document.getElementById('slider-container');
    if (slider) {
      slider.scrollTo({
        left: index * window.innerWidth,
        behavior: 'smooth'
      });
    }
  };

  const nextSlide = () => {
    const newSlide = (currentSlide + 1) % sliders.length;
    scrollToSlide(newSlide);
  };

  const handleGetStartedClick = () => {
    setShowAnalysisPopup(true);

  };

  const closeAnalysisPopup = () => {
    setShowAnalysisPopup(false);
  };

  // Handle wheel scroll
  useEffect(() => {
    const mainContainer = document.querySelector('.w-full.min-h-screen');
    if (mainContainer) {
      mainContainer.style.overflow = 'hidden';
    }

    const sliderContainer = document.getElementById('slider-container');

    const handleWheel = (e) => {
      const inSlider = window.scrollY < window.innerHeight && sliderContainer.contains(e.target);
      if (!inSlider) return;

      e.preventDefault();

      if (e.deltaY > 0) {
        if (currentSlide < sliders.length - 1) {
          scrollToSlide(currentSlide + 1);
        } else {
          if (mainContainer) {
            mainContainer.style.overflow = 'auto';
            const belowSlider = document.getElementById('below-slider');
            if (belowSlider) {
              belowSlider.scrollIntoView({ behavior: 'smooth' });
            }
          }
        }
      } else {
        if (window.scrollY > 50) {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        } else if (currentSlide > 0) {
          scrollToSlide(currentSlide - 1);
        }
      }
    };

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
      if (window.scrollY === 0 && mainContainer) {
        mainContainer.style.overflow = 'hidden';
        scrollToSlide(0);
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [currentSlide, sliders.length]);


  return (
    <div className="w-full min-h-screen overflow-hidden bg-slate-50">

      {/* Enhanced Navbar with scroll effect */}
      <header className={`w-full h-[100px] flex items-center justify-between px-8 py-6 fixed top-0 z-40 transition-all duration-500 ${isScrolled
        ? 'bg-slate-900/95 backdrop-blur-md border-b border-slate-800 shadow-2xl'
        : 'bg-slate-50/95 backdrop-blur-md border-b border-slate-200'
        }`}>
        <div className="flex items-center gap-3 animate-fade-in">
          <div className={`w-12 h-12 bg-gradient-to-r from-teal-600 to-blue-600 rounded-full flex items-center justify-center shadow-lg transform hover:scale-110 transition-all duration-300 hover:shadow-xl ${isScrolled ? 'shadow-purple-500/50' : ''
            }`}>
            <span className="text-white font-bold text-xl animate-pulse">G</span>
          </div>
          <h1 className={`text-3xl font-bold bg-gradient-to-r from-teal-700 to-blue-700 bg-clip-text text-transparent tracking-wide hover:scale-105 transition-transform duration-300 ${isScrolled ? 'from-purple-400 to-blue-400' : ''
            }`}>
            GlowNexa
          </h1>
        </div>

        <nav className="hidden md:flex gap-10 text-base font-semibold">
          <Link to="/about" className={`transition-all duration-300 py-2 relative group ${isScrolled
            ? 'text-slate-300 hover:text-purple-400'
            : 'text-slate-700 hover:text-purple-700'
            }`}>
            About
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-purple-600 group-hover:w-full transition-all duration-300"></span>
          </Link>
          <span
            onClick={() => {
              if (isAuthenticated) {
                navigate("/skinScan");
              } else {
                navigate("/login", { state: { from: "/skinScan" } });
              }
            }}
            className={`cursor-pointer transition-all duration-300 py-2 relative group ${isScrolled
              ? "text-slate-300 hover:text-purple-400"
              : "text-slate-700 hover:text-purple-700"
              }`}
          >
            Analyze Skin
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-purple-600 group-hover:w-full transition-all duration-300"></span>
          </span>

          {/* ✅ Analyze Hair */}
          <span
            onClick={() => {
              if (isAuthenticated) {
                navigate("/hairScan");
              } else {
                navigate("/login", { state: { from: "/hairScan" } });
              }
            }}
            className={`cursor-pointer transition-all duration-300 py-2 relative group ${isScrolled
              ? "text-slate-300 hover:text-purple-400"
              : "text-slate-700 hover:text-purple-700"
              }`}
          >
            Analyze Hair
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-purple-600 group-hover:w-full transition-all duration-300"></span>
          </span>
        </nav>

        <div className="flex items-center gap-6">
          {isAuthenticated ? (
            <button
              onClick={handleLogout}
              className="px-6 py-2.5 text-white font-semibold text-sm rounded-lg bg-gradient-to-r from-pink-400 via-rose-400 to-purple-400 hover:from-pink-500 hover:via-rose-500 hover:to-purple-500 transition-all duration-300 hover:shadow-lg hover:shadow-pink-500/25 transform hover:scale-105 flex items-center justify-center gap-2 "
            >
              Logout
            </button>
          ) : (
            <button
              onClick={() => navigate("/login")}
              className="text-base font-semibold text-blue-600 hover:text-purple-600"
            >
              Sign In
            </button>
          )}

          {/* Enhanced Hamburger */}
          <button
            className={`flex flex-col gap-1 w-7 h-7 justify-center items-center p-1 rounded-lg transition-all duration-300 hover:scale-110 ${isScrolled
              ? 'hover:bg-slate-800'
              : 'hover:bg-slate-200'
              }`}
            onClick={() => setMenuOpen(true)}
          >
            <span className={`h-0.5 w-6 rounded transition-all duration-200 ${isScrolled ? 'bg-slate-300' : 'bg-slate-700'
              }`}></span>
            <span className={`h-0.5 w-6 rounded transition-all duration-200 ${isScrolled ? 'bg-slate-300' : 'bg-slate-700'
              }`}></span>
            <span className={`h-0.5 w-6 rounded transition-all duration-200 ${isScrolled ? 'bg-slate-300' : 'bg-slate-700'
              }`}></span>
          </button>
        </div>
      </header>

      {/* Enhanced Dark Overlay */}
      {menuOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 backdrop-blur-sm animate-fade-in"
          onClick={() => setMenuOpen(false)}
        ></div>
      )}

      {/* Enhanced Sliding Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-80 bg-slate-900/95 backdrop-blur-md shadow-2xl z-50 transform ${menuOpen ? "translate-x-0" : "translate-x-full"
          } transition-transform duration-500 border-l border-slate-800`}
      >
        <div className="p-6">
          <button
            onClick={() => setMenuOpen(false)}
            className="w-8 h-8 bg-slate-800 rounded-full flex items-center justify-center text-slate-300 font-bold hover:bg-purple-600 hover:text-white transition-all duration-300 hover:scale-110"
          >
            ✕
          </button>
        </div>
        m
        <div className="px-6 space-y-6">
          <div className="space-y-4 animate-slide-up">
            <h3 className="text-lg font-semibold text-slate-200">Navigation</h3>
            <ul className="space-y-3">
              <li><Link to="/about" className="text-slate-400 hover:text-purple-400 transition-all duration-300 block py-2 hover:translate-x-2">About Us</Link></li>
              <>
                {/* ✅ Skin Analysis */}
                <li>
                  <span
                    onClick={() => {
                      if (isAuthenticated) {
                        navigate("/skinScan");
                      } else {
                        navigate("/login", { state: { from: "/skinScan" } });
                      }
                    }}
                    className="cursor-pointer text-slate-400 hover:text-purple-400 transition-all duration-300 block py-2 hover:translate-x-2"
                  >
                    Skin Analysis
                  </span>
                </li>

                {/* ✅ Hair Analysis */}
                <li>
                  <span
                    onClick={() => {
                      if (isAuthenticated) {
                        navigate("/hairScan");
                      } else {
                        navigate("/login", { state: { from: "/hairScan" } });
                      }
                    }}
                    className="cursor-pointer text-slate-400 hover:text-purple-400 transition-all duration-300 block py-2 hover:translate-x-2"
                  >
                    Hair Analysis
                  </span>
                </li>

                {/* ✅ Analysis History */}
                <li>
                  <span
                    onClick={() => {
                      if (isAuthenticated) {
                        navigate("/history");
                      } else {
                        navigate("/login", { state: { from: "/history" } });
                      }
                    }}
                    className="cursor-pointer text-slate-400 hover:text-purple-400 transition-all duration-300 block py-2 hover:translate-x-2"
                  >
                    Analysis History
                  </span>
                </li>

                {/* ✅ Contact (Public) */}
                <li>
                  <span
                    onClick={() => {
                      if (isAuthenticated) {
                        navigate("/Contact");
                      } else {
                        navigate("/login", { state: { from: "/hairScan" } });
                      }
                    }}
                    className="cursor-pointer text-slate-400 hover:text-purple-400 transition-all duration-300 block py-2 hover:translate-x-2"
                  >
                    Contact
                  </span>
                </li>
              </>
            </ul>
          </div>

          <div className="space-y-4 border-t border-slate-800 pt-6 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <h3 className="text-lg font-semibold text-slate-200">Account</h3>
            <div className="space-y-3">
              {isAuthenticated ? (
                <button
                  onClick={handleLogout}
                  className="w-full py-2 bg-red-500 rounded-lg hover:bg-red-600"
                >
                  Logout
                </button>
              ) : (
                <button
                  onClick={() => { navigate("/login"); setMenuOpen(false); }}
                  className="w-full py-2 bg-purple-600 rounded-lg hover:bg-purple-700"
                >
                  Sign In
                </button>
              )}
              <button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-xl font-medium hover:shadow-lg hover:shadow-purple-500/25 transform hover:scale-105 transition-all duration-300">
                <Link to="/register">Create Account</Link>
              </button>
            </div>
          </div>

          <div className="space-y-3 border-t border-slate-800 pt-6 animate-slide-up" style={{ animationDelay: '0.4s' }}>
            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wide">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/privacy-policy" className="text-slate-500 hover:text-purple-400 transition-all duration-300 hover:translate-x-1">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Analysis Selection Popup */}
      {showAnalysisPopup && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center animate-fade-in">
          <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-lg w-full mx-4 relative overflow-hidden animate-fade-in-up">
            {/* Animated background elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-400/20 to-blue-400/20 rounded-full -translate-y-8 translate-x-8 animate-pulse-slow"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-br from-blue-400/20 to-indigo-400/20 rounded-full translate-y-4 -translate-x-4 animate-pulse-slow"></div>

            {/* Close button */}
            <button
              onClick={closeAnalysisPopup}
              className="absolute top-6 right-6 w-8 h-8 bg-slate-100 hover:bg-slate-200 rounded-full flex items-center justify-center text-slate-600 font-bold transition-all duration-300 hover:scale-110 z-10"
            >
              ✕
            </button>

            {/* Content */}
            <div className="text-center relative z-10">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl flex items-center justify-center mb-6 mx-auto shadow-lg animate-bounce-subtle">
                <span className="text-white text-2xl animate-pulse">🔍</span>
              </div>

              <h3 className="text-3xl font-bold text-slate-900 mb-4 animate-glow">Choose Your Analysis</h3>
              <p className="text-slate-600 mb-8 text-lg leading-relaxed">
                Select the type of analysis you'd like to perform with our AI-powered technology
              </p>

              <div className="space-y-4">
                <button
                  onClick={() => {
                    if (isAuthenticated) {
                      closeAnalysisPopup();
                      console.log('Analyze Skin clicked');
                      navigate("/skinScan");  // ✅ yahan apni page/route dalna
                    } else {
                      closeAnalysisPopup();
                      navigate("/Login");  // ✅ agar login nahi hai to login page par bhej do
                    }
                  }}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-4 px-6 rounded-xl font-semibold text-lg hover:shadow-xl hover:shadow-purple-500/25 transform hover:scale-105 transition-all duration-300 hover:-translate-y-1 flex items-center justify-center gap-3 animate-slide-in-left"
                >
                  <span className="text-2xl">🧴</span>
                  Analyze Your Skin
                  <span className="ml-auto animate-bounce">→</span>
                </button>


                <button
                  onClick={() => {
                    if (isAuthenticated) {
                      closeAnalysisPopup();
                      console.log('Analyze Hair clicked');
                      navigate("/hair-analysis"); // ✅ apni page/route dalna
                    } else {
                      closeAnalysisPopup();
                      navigate("/Login");
                    }
                  }}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 px-6 rounded-xl font-semibold text-lg hover:shadow-xl hover:shadow-blue-500/25 transform hover:scale-105 transition-all duration-300 hover:-translate-y-1 flex items-center justify-center gap-3 animate-slide-in-right"
                >
                  <span className="text-2xl">💇</span>
                  Analyze Your Hair
                  <span className="ml-auto animate-bounce">→</span>
                </button>

              </div>

              <p className="text-slate-500 text-sm mt-6 animate-fade-in">
                Both analyses use advanced AI technology for accurate results
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Horizontal Slider - RESPONSIVE VERSION */}
      <div className="mt-24">
        <div
          id="slider-container"
          className="h-[90vh] flex overflow-x-scroll snap-x snap-mandatory relative"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none'
          }}
          onScroll={(e) => {
            const scrollLeft = e.target.scrollLeft;
            const slideWidth = window.innerWidth;
            const newSlide = Math.round(scrollLeft / slideWidth);
            setCurrentSlide(newSlide);
          }}
        >
          {sliders.map((slide, index) => (
            <section
              key={index}
              className={`snap-center flex-shrink-0 w-screen h-full relative flex items-center ${slide.bgColor}`}
            >
              {/* Animated background patterns */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-br from-purple-400 to-blue-400 rounded-full animate-float"></div>
                <div className="absolute bottom-32 right-32 w-24 h-24 bg-gradient-to-br from-blue-400 to-indigo-400 rounded-full animate-float-delayed"></div>
                <div className="absolute top-1/2 left-1/3 w-16 h-16 bg-gradient-to-br from-indigo-400 to-purple-400 rounded-full animate-pulse-slow"></div>
              </div>

              {/* Content Container - RESPONSIVE */}
              <div className="w-full max-w-7xl mx-auto px-4 md:px-8 flex flex-col lg:flex-row items-center justify-between relative z-10 gap-6 lg:gap-0 py-8">

                {/* Left Side - Text Content (Appears FIRST on mobile) */}
                <div className="flex-1 max-w-2xl animate-slide-in-left text-center lg:text-left order-1 lg:order-1">
                  <div className={`w-12 h-12 md:w-16 md:h-16 ${slide.iconBg} rounded-2xl flex items-center justify-center mb-4 md:mb-8 shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-500 animate-bounce-subtle mx-auto lg:mx-0`}>
                    {index === 0 && <span className="text-white text-lg md:text-2xl animate-pulse">🔍</span>}
                    {index === 1 && <span className="text-white text-lg md:text-2xl animate-pulse">💡</span>}
                    {index === 2 && <span className="text-white text-lg md:text-2xl animate-pulse">📊</span>}
                    {index === 3 && <span className="text-white text-lg md:text-2xl animate-pulse">💝</span>}
                  </div>

                  <h2 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-slate-900 mb-4 md:mb-6 leading-tight animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                    {slide.title}
                  </h2>

                  <p className="text-base md:text-lg lg:text-xl text-slate-700 mb-6 md:mb-8 leading-relaxed max-w-xl mx-auto lg:mx-0 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
                    {slide.text}
                  </p>

                  <div className="flex flex-col sm:flex-row gap-3 md:gap-4 animate-fade-in-up justify-center lg:justify-start" style={{ animationDelay: '0.6s' }}>
                    <button
                      onClick={handleGetStartedClick}
                      className={`px-6 md:px-8 py-3 md:py-4 bg-gradient-to-r ${slide.iconBg} text-white rounded-xl font-semibold text-base md:text-lg hover:shadow-xl hover:shadow-purple-500/25 transform hover:scale-105 transition-all duration-300 hover:-translate-y-1`}
                    >
                      Get Started →
                    </button>
                    <button className="px-6 md:px-8 py-3 md:py-4 bg-slate-100/80 backdrop-blur-sm text-slate-700 rounded-xl font-semibold text-base md:text-lg border border-slate-300 hover:bg-white hover:shadow-lg transition-all duration-300 hover:scale-105">
                      <Link to="/AiInfo">Learn More</Link>

                    </button>
                  </div>
                </div>

                {/* Right Side - Enhanced Visual Element (Appears SECOND on mobile) */}
                <div className="flex-1 flex items-center justify-center animate-slide-in-right order-2 lg:order-2">
                  <div className={`w-56 h-56 md:w-72 md:h-72 lg:w-80 lg:h-80 xl:w-96 xl:h-96 bg-gradient-to-br ${slide.gradient} rounded-3xl shadow-2xl flex items-center justify-center relative overflow-hidden hover:scale-105 transition-all duration-500 animate-float`}>
                    <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
                    {/* Animated rings */}
                    <div className="absolute inset-4 border-2 border-white/20 rounded-2xl animate-spin-slow"></div>
                    <div className="absolute inset-8 border-2 border-white/30 rounded-xl animate-spin-reverse"></div>

                    <div className="relative z-10 text-center text-white">
                      {index === 0 && (
                        <div className="space-y-3 md:space-y-4 animate-pulse-gentle">
                          <div className="w-20 h-20 md:w-28 md:h-28 lg:w-32 lg:h-32 bg-white/20 rounded-2xl flex items-center justify-center mx-auto backdrop-blur-sm border border-white/20 shadow-lg hover:scale-110 transition-all duration-300">
                            <div className="w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 bg-gradient-to-br from-purple-100 to-blue-100 rounded-xl flex items-center justify-center animate-bounce-gentle">
                              <div className="w-10 h-10 md:w-12 md:h-12 lg:w-16 lg:h-16 bg-white rounded-lg flex items-center justify-center shadow-inner">
                                <span className="text-lg md:text-xl lg:text-2xl animate-spin-slow">🔬</span>
                              </div>
                            </div>
                          </div>
                          <p className="text-base md:text-lg lg:text-xl font-bold animate-fade-in">AI-Powered Analysis</p>
                          <p className="text-xs md:text-sm opacity-80 animate-fade-in" style={{ animationDelay: '0.2s' }}>Advanced machine learning</p>
                        </div>
                      )}
                      {index === 1 && (
                        <div className="space-y-3 md:space-y-4 animate-pulse-gentle">
                          <div className="w-20 h-20 md:w-28 md:h-28 lg:w-32 lg:h-32 bg-white/20 rounded-2xl flex items-center justify-center mx-auto backdrop-blur-sm border border-white/20 shadow-lg hover:scale-110 transition-all duration-300">
                            <div className="w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl flex items-center justify-center animate-bounce-gentle">
                              <div className="w-10 h-10 md:w-12 md:h-12 lg:w-16 lg:h-16 bg-white rounded-lg flex items-center justify-center shadow-inner">
                                <span className="text-lg md:text-xl lg:text-2xl animate-pulse">💊</span>
                              </div>
                            </div>
                          </div>
                          <p className="text-base md:text-lg lg:text-xl font-bold animate-fade-in">Personalized Care</p>
                          <p className="text-xs md:text-sm opacity-80 animate-fade-in" style={{ animationDelay: '0.2s' }}>Customized solutions</p>
                        </div>
                      )}
                      {index === 2 && (
                        <div className="space-y-3 md:space-y-4 animate-pulse-gentle">
                          <div className="w-20 h-20 md:w-28 md:h-28 lg:w-32 lg:h-32 bg-white/20 rounded-2xl flex items-center justify-center mx-auto backdrop-blur-sm border border-white/20 shadow-lg hover:scale-110 transition-all duration-300">
                            <div className="w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-xl flex items-center justify-center animate-bounce-gentle">
                              <div className="w-10 h-10 md:w-12 md:h-12 lg:w-16 lg:h-16 bg-white rounded-lg flex items-center justify-center shadow-inner">
                                <span className="text-lg md:text-xl lg:text-2xl animate-bounce">📊</span>
                              </div>
                            </div>
                          </div>
                          <p className="text-base md:text-lg lg:text-xl font-bold animate-fade-in">Detailed Reports</p>
                          <p className="text-xs md:text-sm opacity-80 animate-fade-in" style={{ animationDelay: '0.2s' }}>Professional insights</p>
                        </div>
                      )}
                      {index === 3 && (
                        <div className="space-y-3 md:space-y-4 animate-pulse-gentle">
                          <div className="w-20 h-20 md:w-28 md:h-28 lg:w-32 lg:h-32 bg-white/20 rounded-2xl flex items-center justify-center mx-auto backdrop-blur-sm border border-white/20 shadow-lg hover:scale-110 transition-all duration-300">
                            <div className="w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 bg-gradient-to-br from-teal-100 to-cyan-100 rounded-xl flex items-center justify-center animate-bounce-gentle">
                              <div className="w-10 h-10 md:w-12 md:h-12 lg:w-16 lg:h-16 bg-white rounded-lg flex items-center justify-center shadow-inner">
                                <span className="text-lg md:text-xl lg:text-2xl animate-pulse">🤝</span>
                              </div>
                            </div>
                          </div>
                          <p className="text-base md:text-lg lg:text-xl font-bold animate-fade-in">Health Companion</p>
                          <p className="text-xs md:text-sm opacity-80 animate-fade-in" style={{ animationDelay: '0.2s' }}>24/7 monitoring</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </section>
          ))}
        </div>

        {/* Enhanced Navigation Controls */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-3 z-30">
          {sliders.map((_, index) => (
            <button
              key={index}
              onClick={() => scrollToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 hover:scale-125 ${currentSlide === index
                ? 'bg-purple-600 shadow-lg shadow-purple-500/50 scale-125 animate-pulse'
                : 'bg-slate-400 hover:bg-purple-500'
                }`}
            />
          ))}
        </div>

        {/* Enhanced Next Button */}
        <button
          onClick={nextSlide}
          className="absolute right-8 top-1/2 -translate-y-1/2 z-30 p-4 bg-slate-900/90 backdrop-blur-sm rounded-full shadow-xl hover:bg-slate-800 hover:shadow-2xl transform hover:scale-110 transition-all duration-300 group"
        >
          <span className="text-2xl text-purple-400 group-hover:translate-x-1 transition-transform duration-300">→</span>
        </button>
      </div>

      {/* Enhanced Dermatology Tool Section */}
      <div id="below-slider" className="min-h-screen bg-gradient-to-br from-slate-100 to-purple-50 py-20">
        <div className="max-w-7xl mx-auto px-8">
          {/* Header */}
          <div className="text-center mb-20 animate-fade-in-up">
            <div className="inline-block p-4 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl mb-6 animate-bounce-subtle">
              <span className="text-3xl text-white animate-pulse">🏥</span>
            </div>
            <h2 className="text-6xl font-bold text-slate-900 mb-6 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>A dermatology tool in your pocket</h2>
            <p className="text-2xl text-slate-700 max-w-3xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.4s' }}>Advanced AI-powered skin analysis at your fingertips</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left Side - Enhanced Mobile Mockup */}
            <div className="flex justify-center animate-slide-in-left">
              <div className="bg-slate-900 rounded-3xl shadow-2xl p-6 max-w-sm transform hover:scale-105 transition-all duration-500 hover:shadow-purple-500/25 relative">
                {/* Phone glow effect */}
                <div className="absolute -inset-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-3xl opacity-20 blur animate-pulse"></div>

                <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl p-6 relative z-10">
                  {/* Mobile Header - Status Bar */}
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-sm font-medium text-slate-600">12:53</span>
                    <div className="flex items-center gap-1">
                      <svg className="w-4 h-4 text-slate-600" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6z" />
                      </svg>
                      <svg className="w-4 h-4 text-slate-600" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                      </svg>
                      <svg className="w-3 h-4 text-slate-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M17.778 8.222c-4.296-4.296-11.26-4.296-15.556 0A1 1 0 01.808 6.808c5.076-5.077 13.308-5.077 18.384 0a1 1 0 01-1.414 1.414zM14.95 11.05a7 7 0 00-9.9 0 1 1 0 01-1.414-1.414 9 9 0 0112.728 0 1 1 0 01-1.414 1.414zM12.12 13.88a3 3 0 00-4.242 0 1 1 0 01-1.415-1.415 5 5 0 017.072 0 1 1 0 01-1.415 1.415zM9 16a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
                      </svg>
                      <span className="text-xs font-semibold text-slate-700">5G+</span>
                      <div className="flex items-center ml-1">
                        <div className="w-1 h-3 bg-slate-700 rounded-sm mr-0.5"></div>
                        <div className="w-1 h-3 bg-slate-700 rounded-sm mr-0.5"></div>
                        <div className="w-1 h-3 bg-slate-700 rounded-sm mr-0.5"></div>
                        <div className="w-1 h-3 bg-slate-400 rounded-sm"></div>
                      </div>
                      <span className="text-sm font-semibold text-slate-700">92%</span>
                    </div>
                  </div>



                  {/* AI Analysis Card */}
                  <div className="bg-white rounded-2xl p-5 mb-4 shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-200">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center flex-1 mr-2">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
                          <Sparkles className="h-6 w-6 text-white" />
                        </div>
                        <h3 className="font-bold text-blue-600 text-base ml-3">AI Skin Analysis & Recommendations</h3>
                      </div>

                      <div className="flex gap-2 flex-shrink-0">
                        <button className="bg-green-500 text-white p-2 rounded-lg shadow-md hover:bg-green-600 transition-colors">
                          <Download className="h-4 w-4" />
                        </button>
                        <button className="bg-purple-500 text-white p-2 rounded-lg shadow-md hover:bg-purple-600 transition-colors">
                          <History className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-4 mb-4">
                      <div className="text-sm text-slate-800 leading-relaxed space-y-2">
                        <p className="font-bold text-slate-900">### 1. SKIN CONDITION ASSESSMENT:</p>
                        <p>
                          <span className="font-semibold">**Overall skin condition:**</span> Your skin generally appears healthy with a relatively even tone. However, there are a few areas that show signs of congestion and fatigue.
                        </p>
                        <p>
                          <span className="font-semibold">**Any visible concerns or abnormalities:**</span>
                        </p>
                        <p>
                          <span className="font-semibold">**Forehead Texture:**</span> There are small, flesh-colored bumps visible on your forehead, which could indicate closed comedones or milia.
                        </p>
                        <p>
                          <span className="font-semibold">**Nose Pores:**</span> Your nose area shows visible pores and possibly some sebaceous filaments/blackheads.
                        </p>
                      </div>
                    </div>



                    {/* Disclaimer */}
                    <div className="bg-yellow-50 border border-yellow-300 rounded-xl p-3">
                      <div className="flex items-start">
                        <div className="bg-yellow-400 p-1.5 rounded-lg mr-2 mt-0.5 flex-shrink-0">
                          <svg className="w-3.5 h-3.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div>
                          <p className="font-semibold text-yellow-800 text-xs mb-1">Important Disclaimer</p>
                          <p className="text-yellow-700 text-xs leading-relaxed">
                            This AI analysis is for informational purposes only and should not replace professional medical advice.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Enhanced Features */}
            <div className="space-y-10 animate-slide-in-right">
              {/* Results Feature */}
              <div className="flex items-start gap-6 group hover:transform hover:scale-105 transition-all duration-500 animate-fade-in-up">
                <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl p-4 shadow-lg group-hover:shadow-xl group-hover:shadow-purple-500/25 transition-all duration-300 animate-bounce-subtle">
                  <div className="w-8 h-8 text-white text-2xl flex items-center justify-center animate-spin-slow">🎯</div>
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-slate-900 mb-3 group-hover:text-purple-800 transition-colors duration-300">INSTANT RESULTS</h3>
                  <p className="text-slate-700 mb-4 text-lg leading-relaxed">Get an instant differential of potential skin conditions with confidence scores and detailed explanations.</p>
                  <button
                    onClick={handleGetStartedClick}
                    className="text-purple-700 font-semibold text-lg hover:text-blue-700 transition-all duration-300 flex items-center gap-2 group-hover:gap-3"
                  >
                    Get Started
                    <span className="transform group-hover:translate-x-1 transition-transform duration-300 animate-bounce">→</span>
                  </button>
                </div>
              </div>

              {/* Personalized Feature */}
              <div className="flex items-start gap-6 group hover:transform hover:scale-105 transition-all duration-500 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-4 shadow-lg group-hover:shadow-xl group-hover:shadow-blue-500/25 transition-all duration-300 animate-bounce-subtle">
                  <div className="w-8 h-8 text-white text-2xl flex items-center justify-center animate-pulse">👤</div>
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-slate-900 mb-3 group-hover:text-blue-800 transition-colors duration-300">PERSONALIZED</h3>
                  <p className="text-slate-700 mb-4 text-lg leading-relaxed">Your results are determined from the photo you upload using advanced artificial intelligence and machine learning algorithms.</p>
                  <button
                    onClick={handleGetStartedClick}
                    className="text-blue-700 font-semibold text-lg hover:text-indigo-700 transition-all duration-300 flex items-center gap-2 group-hover:gap-3"
                  >
                    Get Started
                    <span className="transform group-hover:translate-x-1 transition-transform duration-300 animate-bounce">→</span>
                  </button>
                </div>
              </div>

              {/* Privacy Feature */}
              <div className="flex items-start gap-6 group hover:transform hover:scale-105 transition-all duration-500 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-4 shadow-lg group-hover:shadow-xl group-hover:shadow-indigo-500/25 transition-all duration-300 animate-bounce-subtle">
                  <div className="w-8 h-8 text-white text-2xl flex items-center justify-center animate-pulse-gentle">🔒</div>
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-slate-900 mb-3 group-hover:text-indigo-800 transition-colors duration-300">PRIVACY FIRST</h3>
                  <p className="text-slate-700 mb-4 text-lg leading-relaxed">Everything you share with GlowNexa is confidential and stored securely using enterprise-grade encryption.</p>
                  <Link
                    to="/privacy-policy"
                    className="text-indigo-700 font-semibold text-lg hover:text-purple-700 transition-all duration-300 flex items-center gap-2 group-hover:gap-3"
                  >
                    Privacy Policy
                    <span className="transform group-hover:translate-x-1 transition-transform duration-300 animate-bounce">→</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Additional Content Section */}
      <div className="min-h-screen bg-slate-900 py-20 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-64 h-64 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full animate-float blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-48 h-48 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full animate-float-delayed blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 w-32 h-32 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full animate-pulse-slow blur-2xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-8 relative z-10">
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="text-5xl font-bold mb-6 text-slate-100 animate-glow">Comprehensive Health Solutions</h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              Discover advanced skin and hair care solutions powered by cutting-edge AI technology and medical expertise.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            <div className="bg-gradient-to-br from-slate-800 to-slate-700 p-8 rounded-2xl shadow-lg hover:shadow-2xl hover:shadow-purple-500/25 transform hover:scale-105 transition-all duration-500 border border-slate-600 animate-slide-in" style={{ animationDelay: '0.1s' }}>
              <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg animate-bounce-subtle hover:scale-110 transition-all duration-300">
                <span className="text-white text-2xl animate-spin-slow">🧠</span>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-purple-400 animate-glow">AI Skin Analysis</h3>
              <p className="text-slate-300 leading-relaxed">Advanced machine learning algorithms analyze your skin condition and provide personalized recommendations with medical-grade accuracy.</p>
            </div>

            <div className="bg-gradient-to-br from-slate-800 to-slate-700 p-8 rounded-2xl shadow-lg hover:shadow-2xl hover:shadow-blue-500/25 transform hover:scale-105 transition-all duration-500 border border-slate-600 animate-slide-in" style={{ animationDelay: '0.3s' }}>
              <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg animate-bounce-subtle hover:scale-110 transition-all duration-300">
                <span className="text-white text-2xl animate-pulse">💇</span>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-blue-400 animate-glow">Hair Health Monitor</h3>
              <p className="text-slate-300 leading-relaxed">Track your hair health progress and get customized treatment suggestions from our AI experts with continuous monitoring.</p>
            </div>

            <div className="bg-gradient-to-br from-slate-800 to-slate-700 p-8 rounded-2xl shadow-lg hover:shadow-2xl hover:shadow-indigo-500/25 transform hover:scale-105 transition-all duration-500 border border-slate-600 animate-slide-in" style={{ animationDelay: '0.5s' }}>
              <div className="w-16 h-16 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg animate-bounce-subtle hover:scale-110 transition-all duration-300">
                <span className="text-white text-2xl animate-bounce-gentle">🛍️</span>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-indigo-400 animate-glow">Smart Recommendations</h3>
              <p className="text-slate-300 leading-relaxed">Get personalized skincare and haircare product suggestions based on your unique needs and skin chemistry analysis.</p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-700 p-12 rounded-3xl shadow-2xl text-white relative overflow-hidden animate-fade-in-up">
            <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
            {/* Animated pattern overlay */}
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-0 left-0 w-32 h-32 bg-white rounded-full animate-ping"></div>
              <div className="absolute bottom-0 right-0 w-24 h-24 bg-white rounded-full animate-ping" style={{ animationDelay: '1s' }}></div>
              <div className="absolute top-1/2 left-1/3 w-16 h-16 bg-white rounded-full animate-ping" style={{ animationDelay: '2s' }}></div>
            </div>

            <div className="relative z-10">
              <div className="max-w-4xl">
                <h3 className="text-4xl font-bold mb-6 animate-glow">About GlowNexa</h3>
                <p className="mb-6 text-xl leading-relaxed opacity-90 animate-fade-in" style={{ animationDelay: '0.2s' }}>
                  GlowNexa combines cutting-edge artificial intelligence with dermatological expertise to bring professional-grade skin and hair analysis directly to your device. Our mission is to make quality dermatological care accessible to everyone, anywhere.
                </p>
                <p className="text-lg leading-relaxed opacity-80 animate-fade-in" style={{ animationDelay: '0.4s' }}>
                  With advanced image recognition technology, machine learning algorithms, and a comprehensive database of skin conditions, we provide accurate assessments and personalized care recommendations that help you maintain healthy, glowing skin and hair.
                </p>
                <div className="mt-8 flex flex-col sm:flex-row gap-4 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
                  <button
                    onClick={handleGetStartedClick}
                    className="px-8 py-4 bg-white text-slate-800 rounded-xl font-bold text-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 hover:-translate-y-1 animate-bounce-subtle"
                  >
                    Start Your Analysis
                  </button>
                  <button
                    onClick={() => navigate('/aiInfo')}
                    className="px-8 py-4 bg-white/20 backdrop-blur-sm text-white border border-white/30 rounded-xl font-semibold text-lg hover:bg-white/30 transition-all duration-300 hover:scale-105"
                  >
                    Learn More About AI
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Footer */}
      <footer className="bg-black text-white py-16 relative overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-10 left-10 w-40 h-40 bg-purple-500 rounded-full animate-float blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-32 h-32 bg-blue-500 rounded-full animate-float-delayed blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2 animate-slide-in-left">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center animate-bounce-subtle hover:scale-110 transition-all duration-300">
                  <span className="text-white font-bold text-xl animate-pulse">G</span>
                </div>
                <h3 className="text-2xl font-bold animate-glow">GlowNexa</h3>
              </div>
              <p className="text-slate-400 text-lg leading-relaxed mb-6 max-w-md animate-fade-in">
                Revolutionizing skin and hair care with AI-powered analysis and personalized treatment recommendations.
              </p>
              <div className="flex gap-4">
                <div className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center hover:bg-purple-600 transition-all duration-300 cursor-pointer hover:scale-110 animate-bounce-subtle">
                  <span className="text-sm">📧</span>
                </div>
                <div className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center hover:bg-blue-600 transition-all duration-300 cursor-pointer hover:scale-110 animate-bounce-subtle" style={{ animationDelay: '0.1s' }}>
                  <span className="text-sm">📱</span>
                </div>
                <div className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center hover:bg-indigo-600 transition-all duration-300 cursor-pointer hover:scale-110 animate-bounce-subtle" style={{ animationDelay: '0.2s' }}>
                  <span className="text-sm">🌐</span>
                </div>
              </div>
            </div>

            <div className="animate-slide-in" style={{ animationDelay: '0.2s' }}>
              <h4 className="text-lg font-semibold mb-4 text-purple-400">Services</h4>
              <ul className="space-y-2 text-slate-400">
                <li className="hover:text-white transition-all duration-300 cursor-pointer hover:translate-x-2 animate-fade-in">
                  <Link to="/skinScan">Skin Analysis</Link>
                </li>
                <li className="hover:text-white transition-all duration-300 cursor-pointer hover:translate-x-2 animate-fade-in" style={{ animationDelay: '0.1s' }}>
                  <Link to="/hairScan">Hair Analysis</Link>
                </li>
                <li className="hover:text-white transition-all duration-300 cursor-pointer hover:translate-x-2 animate-fade-in" style={{ animationDelay: '0.3s' }}>
                  <Link to="/History">History</Link>
                </li>
              </ul>
            </div>

            <div className="animate-slide-in" style={{ animationDelay: '0.4s' }}>
              <h4 className="text-lg font-semibold mb-4 text-blue-400">Support</h4>
              <ul className="space-y-2 text-slate-400">
                <li className="hover:text-white transition-all duration-300 cursor-pointer hover:translate-x-2 animate-fade-in">
                  <Link to="/about">About</Link>
                </li>
                <li className="hover:text-white transition-all duration-300 cursor-pointer hover:translate-x-2 animate-fade-in" style={{ animationDelay: '0.1s' }}>
                  <Link to="/Contact">Contact Us</Link>
                </li>
                <li className="hover:text-white transition-all duration-300 cursor-pointer hover:translate-x-2 animate-fade-in" style={{ animationDelay: '0.2s' }}>
                  <Link to="/privacy-policy">Privacy Policy</Link>
                </li>
                <li className="hover:text-white transition-all duration-300 cursor-pointer hover:translate-x-2 animate-fade-in" style={{ animationDelay: '0.3s' }}>
                  <Link to="/AiInfo">Learn more about AI</Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center animate-fade-in-up">
            <p className="text-slate-400 text-sm">
              © 2024 GlowNexa. All rights reserved.
            </p>
            <p className="text-slate-400 text-sm mt-4 md:mt-0 animate-pulse-gentle">
              Made with ❤️ for healthier skin and hair
            </p>
          </div>
        </div>
      </footer>

      {/* Enhanced Custom Animations */}
      <style>{`
        #slider-container::-webkit-scrollbar {
          display: none;
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }
        
        @keyframes bounce-subtle {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-5px); }
        }
        
        @keyframes bounce-gentle {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-3px) scale(1.05); }
        }
        
        @keyframes pulse-slow {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        
        @keyframes pulse-gentle {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.02); }
        }
        
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes spin-reverse {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slide-in {
          from { opacity: 0; transform: translateX(-30px); }
          to { opacity: 1; transform: translateX(0); }
        }
        
        @keyframes slide-in-left {
          from { opacity: 0; transform: translateX(-50px); }
          to { opacity: 1; transform: translateX(0); }
        }
        
        @keyframes slide-in-right {
          from { opacity: 0; transform: translateX(50px); }
          to { opacity: 1; transform: translateX(0); }
        }
        
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes glow {
          0%, 100% { text-shadow: 0 0 5px rgba(147, 51, 234, 0.5); }
          50% { text-shadow: 0 0 20px rgba(147, 51, 234, 0.8), 0 0 30px rgba(147, 51, 234, 0.5); }
        }
        
        .animate-float { animation: float 3s ease-in-out infinite; }
        .animate-float-delayed { animation: float-delayed 3s ease-in-out infinite 1s; }
        .animate-bounce-subtle { animation: bounce-subtle 2s ease-in-out infinite; }
        .animate-bounce-gentle { animation: bounce-gentle 2s ease-in-out infinite; }
        .animate-pulse-slow { animation: pulse-slow 3s ease-in-out infinite; }
        .animate-pulse-gentle { animation: pulse-gentle 2s ease-in-out infinite; }
        .animate-spin-slow { animation: spin-slow 8s linear infinite; }
        .animate-spin-reverse { animation: spin-reverse 10s linear infinite; }
        .animate-fade-in { animation: fade-in 1s ease-out; }
        .animate-fade-in-up { animation: fade-in-up 1s ease-out; }
        .animate-slide-in { animation: slide-in 1s ease-out; }
        .animate-slide-in-left { animation: slide-in-left 1s ease-out; }
        .animate-slide-in-right { animation: slide-in-right 1s ease-out; }
        .animate-slide-up { animation: slide-up 0.8s ease-out; }
        .animate-glow { animation: glow 2s ease-in-out infinite; }
      `}</style>
    </div>
  );

}