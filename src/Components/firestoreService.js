// Firestore service for saving skin analysis data
import { collection, addDoc, getDocs, query, where, doc, updateDoc } from 'firebase/firestore';
import { db } from './firebase';

// Save skin analysis data to Firestore
export const saveSkinAnalysis = async (userId, analysisData) => {
  try {
    const docRef = await addDoc(collection(db, 'skinAnalyses'), {
      userId: userId,
      analysisType: 'skin', // Add type field
      userDetails: {
        age: analysisData.age,
        gender: analysisData.gender,
        skinType: analysisData.skinType
      },
      imageData: {
        originalFileName: analysisData.originalFileName,
        cloudinaryUrl: analysisData.cloudinaryUrl,
        cloudinaryPublicId: analysisData.cloudinaryPublicId
      },
      aiAnalysis: {
        prompt: analysisData.prompt,
        response: analysisData.aiResponse,
        analysisDate: new Date().toISOString(),
        modelUsed: 'gemini-1.5-flash'
      },
      metadata: {
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status: 'completed'
      }
    });

    console.log('Analysis saved with ID: ', docRef.id);
    return {
      success: true,
      analysisId: docRef.id
    };
  } catch (error) {
    console.error('Error saving analysis: ', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Get user's skin analysis history
export const getUserSkinAnalyses = async (userId) => {
  try {
    // Simple query without orderBy to avoid index requirement
    const q = query(
      collection(db, 'skinAnalyses'),
      where('userId', '==', userId)
    );
    
    const querySnapshot = await getDocs(q);
    const analyses = [];
    
    querySnapshot.forEach((doc) => {
      analyses.push({
        id: doc.id,
        ...doc.data()
      });
    });

    // Sort in JavaScript instead of Firestore to avoid index requirement
    analyses.sort((a, b) => {
      const dateA = a.metadata?.createdAt?.toDate ? a.metadata.createdAt.toDate() : new Date(a.metadata?.createdAt || 0);
      const dateB = b.metadata?.createdAt?.toDate ? b.metadata.createdAt.toDate() : new Date(b.metadata?.createdAt || 0);
      return dateB - dateA; // Descending order (newest first)
    });

    return {
      success: true,
      analyses: analyses
    };
  } catch (error) {
    console.error('Error fetching analyses: ', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Update analysis (e.g., add user feedback)
export const updateSkinAnalysis = async (analysisId, updateData) => {
  try {
    const analysisRef = doc(db, 'skinAnalyses', analysisId);
    await updateDoc(analysisRef, {
      ...updateData,
      'metadata.updatedAt': new Date().toISOString()
    });

    return {
      success: true,
      analysisId: analysisId
    };
  } catch (error) {
    console.error('Error updating analysis: ', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Save hair analysis data to Firestore
export const saveHairAnalysis = async (userId, analysisData) => {
  try {
    const docRef = await addDoc(collection(db, 'skinAnalyses'), { // Using same collection for unified history
      userId: userId,
      analysisType: 'hair', // Add type field to distinguish
      userDetails: {
        age: analysisData.age,
        gender: analysisData.gender,
        hairType: analysisData.hairType
      },
      imageData: {
        originalFileName: analysisData.originalFileName,
        cloudinaryUrl: analysisData.cloudinaryUrl,
        cloudinaryPublicId: analysisData.cloudinaryPublicId
      },
      aiAnalysis: {
        prompt: `Hair analysis for ${analysisData.age} year old ${analysisData.gender} with ${analysisData.hairType} hair`,
        response: analysisData.aiAnalysis,
        analysisDate: new Date().toISOString(),
        modelUsed: 'gemini-1.5-flash'
      },
      metadata: {
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status: 'completed'
      }
    });

    console.log('Hair analysis saved with ID: ', docRef.id);
    return {
      success: true,
      analysisId: docRef.id
    };
  } catch (error) {
    console.error('Error saving hair analysis: ', error);
    return {
      success: false,
      error: error.message
    };
  }
};
