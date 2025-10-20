import React from 'react';
import { Link } from 'react-router-dom'; // Use this if you are using React Router for navigation
// If not using React Router, you can replace <Link> with <a> tags.

// You can import icons from a library like 'react-icons'
// yarn add react-icons
// import { FaUpload, FaStethoscope, FaClipboardList } from 'react-icons/fa';

const About = () => {
  return (
    <div className="bg-gray-50 min-h-screen py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        
        {/* --- Header --- */}
        <h1 className="text-4xl font-extrabold text-center text-gray-900 sm:text-5xl mb-12">
          About <span className="text-indigo-600">Glownexa</span>
        </h1>

        {/* --- Our Mission Section --- */}
        <div className="bg-white shadow-xl rounded-lg overflow-hidden p-6 md:p-10 mb-10">
          <h2 className="text-3xl font-bold text-indigo-700 mb-4">Our Mission</h2>
          <p className="text-lg text-gray-700 leading-relaxed">
            At Glownexa, our mission is to make preliminary skin and hair health assessment accessible, convenient, and informative. We understand that getting answers about dermatological concerns can be slow and difficult. We leverage cutting-edge **artificial intelligence** to provide instant, confidential analysis, helping you understand your condition better and guiding you on when to seek professional medical advice.
          </p>
        </div>

        {/* --- How It Works Section --- */}
        <div className="bg-white shadow-xl rounded-lg overflow-hidden p-6 md:p-10 mb-10">
          <h2 className="text-3xl font-bold text-indigo-700 mb-8 text-center">
            How It Works
          </h2>
          <div className="grid md:grid-cols-3 gap-8 text-center">
            
            {/* Step 1 */}
            <div className="flex flex-col items-center">
              {/* Icon Placeholder (Example using Tailwind) */}
              <div className="bg-indigo-100 rounded-full h-20 w-20 flex items-center justify-center mb-4">
                <svg className="h-10 w-10 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
                {/* Or use: <FaUpload className="h-10 w-10 text-indigo-600" /> */}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">1. Upload Image</h3>
              <p className="text-gray-600">Take or upload a clear, well-lit photo of the affected skin or hair area.</p>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col items-center">
              <div className="bg-indigo-100 rounded-full h-20 w-20 flex items-center justify-center mb-4">
                <svg className="h-10 w-10 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17.25l.038-.038A5.25 5.25 0 0112 13.5a5.25 5.25 0 012.212 3.712l.038.038M9.75 17.25H12m0 0H9.75m2.25 0V15m0 2.25v-2.25m0 0a5.25 5.25 0 01-5.25-5.25v-1.5a5.25 5.25 0 1110.5 0v1.5a5.25 5.25 0 01-5.25 5.25m0 0H9.75" />
                </svg>
                {/* Or use: <FaStethoscope className="h-10 w-10 text-indigo-600" /> */}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">2. Get AI Analysis</h3>
              <p className="text-gray-600">Our AI model analyzes the image against a vast database of conditions in seconds.</p>
            </div>
            
            {/* Step 3 */}
            <div className="flex flex-col items-center">
              <div className="bg-indigo-100 rounded-full h-20 w-20 flex items-center justify-center mb-4">
                <svg className="h-10 w-10 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                {/* Or use: <FaClipboardList className="h-10 w-10 text-indigo-600" /> */}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">3. Receive Insights</h3>
              <p className="text-gray-600">Get a report with potential matching conditions and next steps.</p>
            </div>
          </div>
        </div>

        {/* --- Important Disclaimer --- */}
        <div className="bg-red-50 border-l-4 border-red-500 text-red-900 p-6 rounded-lg shadow-md mb-10">
          <h3 className="text-xl font-bold mb-2">Important Medical Disclaimer</h3>
          <p className="text-md leading-relaxed">
            Glownexa is an informational tool and **is not a substitute for professional medical diagnosis or treatment.** Our AI provides a preliminary analysis based on patterns, but it is not a doctor and can make mistakes. Always consult a qualified dermatologist or healthcare provider for any health concerns or before making any medical decisions.
          </p>
        </div>
        
        {/* --- Meet the Team (Placeholder) --- */}
        <div className="bg-white shadow-xl rounded-lg overflow-hidden p-6 md:p-10 mb-10">
          <h2 className="text-3xl font-bold text-indigo-700 mb-8 text-center">
            Meet Our Team
          </h2>
          <p className="text-center text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            We are a passionate team of developers, designers, and AI specialists dedicated to making health technology more accessible.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            
            {/* Team Member 1 (Placeholder) */}
            <div className="text-center">
              <div className="bg-gray-200 h-32 w-32 rounded-full mx-auto mb-4 flex items-center justify-center text-gray-400">
                {/* Replace with <img /> tag */}
                Image
              </div>
              <h4 className="text-xl font-semibold text-gray-900">Your Name</h4>
              <p className="text-indigo-600">Lead Developer / Project Lead</p>
            </div>
            
            {/* Team Member 2 (Placeholder) */}
            <div className="text-center">
              <div className="bg-gray-200 h-32 w-32 rounded-full mx-auto mb-4 flex items-center justify-center text-gray-400">
                {/* Replace with <img /> tag */}
                Image
              </div>
              <h4 className="text-xl font-semibold text-gray-900">Team Member</h4>
              <p className="text-indigo-600">AI/ML Specialist</p>
            </div>
            
            {/* Team Member 3 (Placeholder) */}
            <div className="text-center">
              <div className="bg-gray-200 h-32 w-32 rounded-full mx-auto mb-4 flex items-center justify-center text-gray-400">
                {/* Replace with <img /> tag */}
                Image
              </div>
              <h4 className="text-xl font-semibold text-gray-900">Team Member</h4>
              <p className="text-indigo-600">UX/UI Designer</p>
            </div>
            
          </div>
        </div>

        {/* --- Call to Action (CTA) --- */}
        <div className="text-center">
          <Link
            to="/detector" // Change this to your detection page route
            className="inline-block bg-indigo-600 text-white font-bold text-lg px-8 py-4 rounded-lg shadow-md hover:bg-indigo-700 transition duration-300"
          >
            Try the Glownexa Detector
          </Link>
        </div>

      </div>
    </div>
  );
};

export default About;
