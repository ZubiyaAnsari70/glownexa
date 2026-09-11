import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
// Only import getCombinedAnalysisHistory
import { getCombinedAnalysisHistory, deleteAnalysis } from './firestoreService';
import { Loader2 } from 'lucide-react';
const History = () => {
  const [analyses, setAnalyses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedAnalysis, setSelectedAnalysis] = useState(null);
  const navigate = useNavigate();

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [analysisToDelete, setAnalysisToDelete] = useState(null); // { id, type, scanId } store karega
  const [isDeleting, setIsDeleting] = useState(false);
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
      const result = await getCombinedAnalysisHistory(userId);

      if (result.success) {
        setAnalyses(Array.isArray(result.analyses) ? result.analyses : []);
      } else {
        setError(result.error || 'Failed to load analysis history');
        setAnalyses([]);
      }
    } catch (err) {
      console.error('Error loading history:', err);
      setError('Failed to load analysis history. Please try again.');
      setAnalyses([]);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'Unknown date';
    // Use Firestore Timestamp's toDate() method if available, otherwise assume string/number
    const date = timestamp && typeof timestamp.toDate === 'function'
      ? timestamp.toDate()
      : new Date(timestamp);

    // Check if the date is valid before formatting
    if (isNaN(date.getTime())) {
      return 'Invalid date';
    }

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
    link.download = filename || 'analysis-image.jpg'; // Generic fallback filename
    link.target = '_blank'; // Open in new tab might be better for some browsers
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // handleDelete function removed

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-12 h-12 sm:w-16 sm:h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-base sm:text-lg text-slate-600">Loading your analysis history...</p>
        </div>
      </div>
    );
  }



  const handleDelete = (e, analysisId, analysisType, scanId) => {
    e.stopPropagation(); // Card click ko roke

    if (!scanId) {
      alert("Error: Cannot delete, Scan ID is missing.");
      console.error("Attempted to delete analysis without a scanId:", analysisId, analysisType);
      return;
    }

    setAnalysisToDelete({ id: analysisId, type: analysisType, scanId: scanId });
    setShowConfirmModal(true);
  };

  const confirmDeleteAction = async () => {
    if (!analysisToDelete) return;

    setIsDeleting(true);
    setError(null);

    try {
      const { id, type, scanId } = analysisToDelete;
      const result = await deleteAnalysis(id, type, scanId);

      if (result.success) {
        setAnalyses(prevAnalyses =>
          prevAnalyses.filter(analysis => analysis.id !== id)
        );
        setShowConfirmModal(false);
        setAnalysisToDelete(null);
      } else {
        setError(result.error || 'Failed to delete analysis');
        alert(`Failed to delete analysis: ${result.error}`);
        // Optionally close modal: setShowConfirmModal(false); setAnalysisToDelete(null); 
      }
    } catch (err) {
      setError('An error occurred during deletion.');
      alert(`An error occurred: ${err.message}`);
      // Optionally close modal: setShowConfirmModal(false); setAnalysisToDelete(null);
    } finally {
      setIsDeleting(false);
    }
  };

  
  const cancelDelete = () => {
    setShowConfirmModal(false);
    setAnalysisToDelete(null);
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-lg sticky top-0 z-40"> {/* Made header sticky */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          {/* Responsive Header Layout */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6">
            <div className="text-center sm:text-left">
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Analysis History</h1>
              <p className="text-slate-600 text-sm sm:text-base mt-1">View your past skin and hair analysis results</p>
            </div>
            {/* Responsive Buttons */}
            <div className="flex flex-wrap justify-center sm:justify-end gap-2 sm:gap-3 lg:gap-4">
              <button
                onClick={() => navigate('/skinScan')}
                className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 sm:px-5 sm:py-2.5 rounded-lg text-sm sm:text-base font-medium hover:shadow-lg transform hover:scale-105 transition-all duration-300 whitespace-nowrap"
              >
                New Skin Analysis
              </button>
              <button
                onClick={() => navigate('/hairScan')}
                className="bg-gradient-to-r from-orange-600 to-red-600 text-white px-4 py-2 sm:px-5 sm:py-2.5 rounded-lg text-sm sm:text-base font-medium hover:shadow-lg transform hover:scale-105 transition-all duration-300 whitespace-nowrap"
              >
                New Hair Analysis
              </button>
              <button
                onClick={() => navigate('/')}
                className="bg-slate-200 text-slate-700 px-4 py-2 sm:px-5 sm:py-2.5 rounded-lg text-sm sm:text-base font-medium hover:bg-slate-300 transition-all duration-300 whitespace-nowrap"
              >
                Back to Home
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Responsive Padding for Main Content */}
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-6 sm:py-8">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 sm:p-4 mb-6">
            <div className="flex items-center">
              <div className="text-red-500 mr-3 text-lg sm:text-xl">⚠️</div>
              <div>
                <h3 className="text-red-800 font-medium text-sm sm:text-base">Error</h3>
                <p className="text-red-600 text-xs sm:text-sm">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* --- No History Section --- */}
        {analyses.length === 0 && !loading ? ( // Added !loading check
          <div className="text-center py-12 sm:py-16">
            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
              <span className="text-white text-3xl sm:text-4xl">📋</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-4">No Analysis History</h3>
            <p className="text-slate-600 mb-8 max-w-md mx-auto text-sm sm:text-base">
              You haven't performed any analyses yet. Start your first analysis to see results here.
            </p>
            {/* Responsive Buttons in No History */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <button
                onClick={() => navigate('/skinScan')}
                className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 sm:px-8 sm:py-4 rounded-lg font-medium hover:shadow-lg transform hover:scale-105 transition-all duration-300 text-sm sm:text-base"
              >
                Start Skin Analysis
              </button>
              <button
                onClick={() => navigate('/hairScan')}
                className="bg-gradient-to-r from-orange-600 to-red-600 text-white px-6 py-3 sm:px-8 sm:py-4 rounded-lg font-medium hover:shadow-lg transform hover:scale-105 transition-all duration-300 text-sm sm:text-base"
              >
                Start Hair Analysis
              </button>
            </div>
          </div>
        ) : (
          // --- History Grid ---
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {Array.isArray(analyses) && analyses.map((analysis, index) => (
              <div
                key={analysis.id || `analysis-${index}`}
                className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer transform hover:scale-[1.03]" // Slightly reduced hover scale
                onClick={() => setSelectedAnalysis(analysis)}
              >
                {/* Image */}
                <div className="relative">
                  {analysis.imageData?.cloudinaryUrl ? (
                    <img
                      src={analysis.imageData.cloudinaryUrl}
                      alt={`${analysis.analysisType || 'Skin'} Analysis`}
                      className="w-full h-40 sm:h-48 object-cover" // Adjusted height
                      onError={(e) => { e.target.style.display = 'none'; /* Hide if image fails */ }}
                    />
                  ) : (
                    <div className="w-full h-40 sm:h-48 bg-gray-200 flex items-center justify-center text-gray-400">
                      No Image
                    </div>
                  )}
                  <div className="absolute top-3 left-3 sm:top-4 sm:left-4 bg-white/90 backdrop-blur-sm rounded-lg px-2 py-1 sm:px-3">
                    <span className="text-xs sm:text-sm font-medium text-slate-700">
                      {analysis.analysisType === 'hair' ? '🦱 Hair' : '🔍 Skin'} Analysis #{analyses.length - index}
                    </span>
                  </div>
                  <div className={`absolute top-3 right-3 sm:top-4 sm:right-4 px-2 py-1 rounded-lg text-xs font-medium ${analysis.analysisType === 'hair'
                    ? 'bg-orange-500 text-white'
                    : 'bg-purple-500 text-white'
                    }`}>
                    {analysis.analysisType === 'hair' ? 'Hair' : 'Skin'}
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 sm:p-6">
                  <div className="flex items-center justify-between mb-3 sm:mb-4">
                    <div className="text-xs sm:text-sm text-slate-500">
                      {/* Using metadata.createdAt for date */}
                      {formatDate(analysis.metadata?.createdAt)}
                    </div>
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                      Completed
                    </span>
                  </div>

                  <div className="space-y-1.5 sm:space-y-2 mb-3 sm:mb-4">
                    <div className="flex justify-between text-xs sm:text-sm">
                      <span className="text-slate-600">Age:</span>
                      <span className="font-medium">{analysis.userDetails?.age || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between text-xs sm:text-sm">
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
                    <div className="flex justify-between text-xs sm:text-sm">
                      <span className="text-slate-600">Gender:</span>
                      <span className="font-medium capitalize">{analysis.userDetails?.gender || 'N/A'}</span>
                    </div>
                  </div>

                  <div className="text-xs sm:text-sm text-slate-600 line-clamp-2 sm:line-clamp-3 mb-4"> {/* Adjusted line-clamp */}
                    {analysis.aiAnalysis?.response?.substring(0, 100)}...
                  </div>

                  {/* --- Buttons Row (View Details & Delete) --- */}
                  <div className="flex items-center justify-between pt-3 sm:pt-4 border-t border-slate-100">
                    {/* View Details Button */}
                    <button className={`font-medium text-xs sm:text-sm hover:underline ${analysis.analysisType === 'hair' ? 'text-orange-600 hover:text-orange-800' : 'text-purple-600 hover:text-purple-800'}`}> View Details → </button>

                    {/* --- DELETE BUTTON ADDED --- */}
                    <button
                      // Pass event, analysis ID, type, and importantly scanId
                      onClick={(e) => handleDelete(e, analysis.id, analysis.analysisType, analysis.scanId)}
                      className="font-medium text-xs sm:text-sm text-red-500 hover:text-red-700 hover:underline px-2 py-1 rounded hover:bg-red-50 transition-colors"
                      // Disable if scanId is missing (important safety check)
                      disabled={!analysis.scanId}
                      title={!analysis.scanId ? "Cannot delete: Scan ID missing" : "Delete Analysis"}
                    >
                      Delete
                    </button>
                    {/* --- END DELETE BUTTON --- */}
                  </div>
                  {/* --- End Buttons Row --- */}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* --- Analysis Detail Modal --- */}
      {selectedAnalysis && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4">
          {/* Responsive Modal Width and Height */}
          <div className="bg-white rounded-2xl shadow-2xl w-full sm:max-w-4xl max-h-[95vh] sm:max-h-[90vh] overflow-hidden flex flex-col">
            {/* Header */}
            <div className="shrink-0 bg-white border-b border-slate-200 p-4 sm:p-6 flex items-center justify-between">
              <div>
                <h2 className="text-lg sm:text-2xl font-bold text-slate-900 flex items-center space-x-2">
                  <span>{selectedAnalysis.analysisType === 'hair' ? '🦱' : '🔍'}</span>
                  <span>{selectedAnalysis.analysisType === 'hair' ? 'Hair' : 'Skin'} Analysis Details</span>
                </h2>
                {/* Using metadata.createdAt for date */}
                <p className="text-slate-600 text-xs sm:text-sm">{formatDate(selectedAnalysis.metadata?.createdAt)}</p>
              </div>
              <button
                onClick={() => setSelectedAnalysis(null)}
                className="w-7 h-7 sm:w-8 sm:h-8 bg-slate-100 hover:bg-slate-200 rounded-full flex items-center justify-center text-slate-600 font-bold transition-all duration-300"
                aria-label="Close modal" // Added aria-label for accessibility
              >
                ✕
              </button>
            </div>

            {/* Scrollable Content Area */}
            <div className="flex-grow overflow-y-auto p-4 sm:p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
                {/* Image Section */}
                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-slate-900 mb-3 sm:mb-4">Analyzed Image</h3>
                  <div className="relative">
                    {selectedAnalysis.imageData?.cloudinaryUrl ? (
                      <img
                        src={selectedAnalysis.imageData.cloudinaryUrl}
                        alt={`${selectedAnalysis.analysisType || 'Skin'} Analysis`}
                        className="w-full rounded-lg shadow-md"
                      />
                    ) : (
                      <div className="w-full aspect-video bg-gray-200 rounded-lg flex items-center justify-center text-gray-400">
                        No Image Available
                      </div>
                    )}
                    {selectedAnalysis.imageData?.cloudinaryUrl && ( // Only show download if URL exists
                      <button
                        onClick={() => downloadImage(
                          selectedAnalysis.imageData.cloudinaryUrl,
                          selectedAnalysis.imageData.originalFileName
                        )}
                        className="absolute top-2 right-2 sm:top-4 sm:right-4 bg-white/90 backdrop-blur-sm hover:bg-white rounded-lg p-2 shadow-md transition-all duration-300"
                        title="Download Image" // Added title
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>

                {/* Details Section */}
                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-slate-900 mb-3 sm:mb-4">User Information</h3>
                  <div className="bg-slate-50 rounded-lg p-3 sm:p-4 space-y-2 sm:space-y-3 mb-5 sm:mb-6 text-xs sm:text-sm">
                    {/* User info items */}
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
                    <div className="flex justify-between items-center">
                      <span className="text-slate-600">Analysis Type:</span>
                      <span className={`font-medium capitalize px-2 py-0.5 rounded text-xs ${ // Reduced padding/size
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

                  <h3 className="text-base sm:text-lg font-semibold text-slate-900 mb-3 sm:mb-4">AI Analysis Results</h3>
                  <div className={`rounded-lg p-4 sm:p-6 ${selectedAnalysis.analysisType === 'hair'
                    ? 'bg-gradient-to-br from-orange-50 to-red-50'
                    : 'bg-gradient-to-br from-purple-50 to-blue-50'
                    }`}>

                    <div className="prose prose-sm max-w-none text-slate-700 whitespace-pre-wrap">
 
                      {selectedAnalysis.aiAnalysis?.response || 'No analysis text available.'}
                    </div>
                  </div>
                </div>
              </div>
            </div> {/* End Scrollable Content Area */}
          </div>
        </div>
      )}
      {/* --- End Analysis Detail Modal --- */}
      {showConfirmModal && analysisToDelete && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-sm w-full">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Confirm Deletion</h3>
            <p className="text-sm text-slate-600 mb-6">
              Are you sure you want to delete this analysis record? This action cannot be undone.
            </p>
            {/* Show error within modal if delete fails */}
            {error && !isDeleting && (
              <p className="text-xs text-red-600 mb-4">{error}</p>
            )}
            <div className="flex justify-end gap-3">
              <button
                onClick={cancelDelete}
                disabled={isDeleting} // Disable cancel while deleting
                className="px-4 py-2 bg-slate-100 text-slate-700 rounded-md text-sm font-medium hover:bg-slate-200 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteAction}
                disabled={isDeleting} // Disable button while deleting
                className="px-4 py-2 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Deleting...
                  </>
                ) : (
                  'Delete'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default History;