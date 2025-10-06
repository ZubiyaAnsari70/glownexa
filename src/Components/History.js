import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { getUserSkinAnalyses } from './firestoreService';

const History = () => {
  const [analyses, setAnalyses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedAnalysis, setSelectedAnalysis] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        loadUserHistory(currentUser.uid);
      } else {
        navigate('/login');
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const loadUserHistory = async (userId) => {
    try {
      setLoading(true);
      setError(null);
      const result = await getUserSkinAnalyses(userId);
      
      if (result.success) {
        // Extract the analyses array from the result
        setAnalyses(Array.isArray(result.analyses) ? result.analyses : []);
      } else {
        setError(result.error || 'Failed to load analysis history');
        setAnalyses([]);
      }
    } catch (err) {
      console.error('Error loading history:', err);
      setError('Failed to load analysis history. Please try again.');
      setAnalyses([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'Unknown date';
    
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const downloadImage = (imageUrl, filename) => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = filename || 'skin-analysis-image.jpg';
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg text-slate-600">Loading your analysis history...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Analysis History</h1>
              <p className="text-slate-600 mt-1">View your past skin and hair analysis results</p>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={() => navigate('/skinScan')}
                className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:shadow-lg transform hover:scale-105 transition-all duration-300"
              >
                New Skin Analysis
              </button>
              <button
                onClick={() => navigate('/hairScan')}
                className="bg-gradient-to-r from-orange-600 to-red-600 text-white px-6 py-3 rounded-lg font-medium hover:shadow-lg transform hover:scale-105 transition-all duration-300"
              >
                New Hair Analysis
              </button>
              <button
                onClick={() => navigate('/')}
                className="bg-slate-200 text-slate-700 px-6 py-3 rounded-lg font-medium hover:bg-slate-300 transition-all duration-300"
              >
                Back to Home
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <div className="text-red-500 mr-3">⚠️</div>
              <div>
                <h3 className="text-red-800 font-medium">Error</h3>
                <p className="text-red-600">{error}</p>
              </div>
            </div>
          </div>
        )}

        {analyses.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-white text-3xl">📋</span>
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-4">No Analysis History</h3>
            <p className="text-slate-600 mb-8 max-w-md mx-auto">
              You haven't performed any skin or hair analyses yet. Start your first analysis to see your results here.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate('/skinScan')}
                className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-4 rounded-lg font-medium hover:shadow-lg transform hover:scale-105 transition-all duration-300"
              >
                Start Skin Analysis
              </button>
              <button
                onClick={() => navigate('/hairScan')}
                className="bg-gradient-to-r from-orange-600 to-red-600 text-white px-8 py-4 rounded-lg font-medium hover:shadow-lg transform hover:scale-105 transition-all duration-300"
              >
                Start Hair Analysis
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.isArray(analyses) && analyses.map((analysis, index) => (
              <div
                key={analysis.id || `analysis-${index}`}
                className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer transform hover:scale-105"
                onClick={() => setSelectedAnalysis(analysis)}
              >
                {/* Image */}
                <div className="relative">
                  <img
                    src={analysis.imageData?.cloudinaryUrl}
                    alt={`${analysis.analysisType || 'Skin'} Analysis`}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-1">
                    <span className="text-sm font-medium text-slate-700">
                      {analysis.analysisType === 'hair' ? '🦱 Hair' : '🔍 Skin'} Analysis #{analyses.length - index}
                    </span>
                  </div>
                  <div className={`absolute top-4 right-4 px-2 py-1 rounded-lg text-xs font-medium ${
                    analysis.analysisType === 'hair' 
                      ? 'bg-orange-500 text-white' 
                      : 'bg-purple-500 text-white'
                  }`}>
                    {analysis.analysisType === 'hair' ? 'Hair' : 'Skin'}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-sm text-slate-500">
                      {formatDate(analysis.metadata?.createdAt)}
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                        Completed
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Age:</span>
                      <span className="font-medium">{analysis.userDetails?.age || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">
                        {analysis.analysisType === 'hair' ? 'Hair Type:' : 'Skin Type:'}
                      </span>
                      <span className="font-medium capitalize">
                        {analysis.analysisType === 'hair' 
                          ? analysis.userDetails?.hairType || 'N/A'
                          : analysis.userDetails?.skinType || 'N/A'
                        }
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Gender:</span>
                      <span className="font-medium capitalize">{analysis.userDetails?.gender || 'N/A'}</span>
                    </div>
                  </div>

                  <div className="text-sm text-slate-600 line-clamp-3">
                    {analysis.aiAnalysis?.response?.substring(0, 100)}...
                  </div>

                  <div className="mt-4 pt-4 border-t border-slate-100">
                    <button className={`font-medium text-sm hover:underline ${
                      analysis.analysisType === 'hair' 
                        ? 'text-orange-600 hover:text-orange-800' 
                        : 'text-purple-600 hover:text-purple-800'
                    }`}>
                      View Details →
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Analysis Detail Modal */}
      {selectedAnalysis && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-slate-200 p-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 flex items-center space-x-2">
                  <span>{selectedAnalysis.analysisType === 'hair' ? '🦱' : '🔍'}</span>
                  <span>{selectedAnalysis.analysisType === 'hair' ? 'Hair' : 'Skin'} Analysis Details</span>
                </h2>
                <p className="text-slate-600">{formatDate(selectedAnalysis.metadata?.createdAt)}</p>
              </div>
              <button
                onClick={() => setSelectedAnalysis(null)}
                className="w-8 h-8 bg-slate-100 hover:bg-slate-200 rounded-full flex items-center justify-center text-slate-600 font-bold transition-all duration-300"
              >
                ✕
              </button>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Image Section */}
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">Analyzed Image</h3>
                  <div className="relative">
                    <img
                      src={selectedAnalysis.imageData?.cloudinaryUrl}
                      alt={`${selectedAnalysis.analysisType || 'Skin'} Analysis`}
                      className="w-full rounded-lg shadow-md"
                    />
                    <button
                      onClick={() => downloadImage(
                        selectedAnalysis.imageData?.cloudinaryUrl,
                        selectedAnalysis.imageData?.originalFileName
                      )}
                      className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm hover:bg-white rounded-lg p-2 shadow-md transition-all duration-300"
                    >
                      📥
                    </button>
                  </div>
                </div>

                {/* Details Section */}
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">User Information</h3>
                  <div className="bg-slate-50 rounded-lg p-4 space-y-3 mb-6">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Age:</span>
                      <span className="font-medium">{selectedAnalysis.userDetails?.age || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Gender:</span>
                      <span className="font-medium capitalize">{selectedAnalysis.userDetails?.gender || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">
                        {selectedAnalysis.analysisType === 'hair' ? 'Hair Type:' : 'Skin Type:'}
                      </span>
                      <span className="font-medium capitalize">
                        {selectedAnalysis.analysisType === 'hair' 
                          ? selectedAnalysis.userDetails?.hairType || 'N/A'
                          : selectedAnalysis.userDetails?.skinType || 'N/A'
                        }
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Analysis Type:</span>
                      <span className={`font-medium capitalize px-2 py-1 rounded text-sm ${
                        selectedAnalysis.analysisType === 'hair' 
                          ? 'bg-orange-100 text-orange-800' 
                          : 'bg-purple-100 text-purple-800'
                      }`}>
                        {selectedAnalysis.analysisType === 'hair' ? 'Hair Analysis' : 'Skin Analysis'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Analysis Model:</span>
                      <span className="font-medium">{selectedAnalysis.aiAnalysis?.modelUsed || 'Gemini AI'}</span>
                    </div>
                  </div>

                  <h3 className="text-lg font-semibold text-slate-900 mb-4">AI Analysis Results</h3>
                  <div className={`rounded-lg p-6 ${
                    selectedAnalysis.analysisType === 'hair' 
                      ? 'bg-gradient-to-br from-orange-50 to-red-50' 
                      : 'bg-gradient-to-br from-purple-50 to-blue-50'
                  }`}>
                    <div className="prose prose-sm max-w-none text-slate-700 whitespace-pre-wrap">
                      {selectedAnalysis.aiAnalysis?.response}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default History;
