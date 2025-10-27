import React from 'react';
import { useNavigate } from 'react-router-dom';

const AiInfo = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="p-8">
          <button onClick={() => navigate(-1)} className="text-sm text-slate-600 hover:underline mb-4">← Back</button>
          <h1 className="text-3xl font-bold text-slate-900 mb-4">About the AI Behind GlowNexa</h1>
          <p className="text-slate-700 mb-4">GlowNexa uses modern machine learning models trained on curated dermatological datasets to provide initial assessments of skin and hair conditions. Our system is intended to assist users with early detection and educational information — it does not replace professional medical diagnosis.</p>

          <h2 className="text-xl font-semibold text-slate-900 mt-6 mb-2">How it works</h2>
          <ul className="list-disc pl-6 text-slate-700 space-y-2">
            <li>Image preprocessing — normalization and resizing to preserve critical visual features.</li>
            <li>Feature extraction — deep convolutional layers identify patterns and textures consistent with dermatological conditions.</li>
            <li>Model inference — ensembled models evaluate outputs and produce explainable insights and confidence scores.</li>
          </ul>

          <h2 className="text-xl font-semibold text-slate-900 mt-6 mb-2">Limitations</h2>
          <p className="text-slate-700">AI models are sensitive to image quality, lighting, and viewpoint. They provide probabilistic assessments and may not generalize to all skin tones or rare conditions. Always consult a qualified dermatologist for definitive diagnosis.</p>

          <h2 className="text-xl font-semibold text-slate-900 mt-6 mb-2">Privacy & Safety</h2>
          <p className="text-slate-700">Uploaded images are processed securely and stored according to our privacy policy. We recommend reading our privacy policy for details on data retention and sharing.</p>

          <div className="mt-8 p-4 bg-gradient-to-r from-cyan-50 to-purple-50 rounded-lg border border-slate-100">
            <h3 className="font-semibold text-slate-900 mb-2">Want to learn more?</h3>
            <p className="text-slate-700">You can find references to the underlying research in our docs and publications. If you have specific questions about the model or dataset, contact our team.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AiInfo;
