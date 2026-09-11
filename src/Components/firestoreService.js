// Firestore service for saving analysis data (ER Diagram Aligned)
import { collection, addDoc, getDocs, query, where, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from './firebase';

const getDocDate = (doc) => {
  if (doc.metadata && doc.metadata.createdAt) {
    return new Date(doc.metadata.createdAt); // Naya structure
  }
  if (doc.createdAt) {
    return new Date(doc.createdAt); // Purana structure
  }
  return new Date(0); // Fallback
};

/**
  Save skin analysis data based on the ER Diagram.
  Step 1: Creates a document in 'scans' collection.
  Step 2: Creates a document in 'skin_analyses' collection with denormalized data for History page.
 */
export const saveSkinAnalysis = async (userId, analysisData) => {
  try {
    // Step 1: Save the initial scan details to 'scans' collection
    const scanRef = await addDoc(collection(db, 'scans'), {
      userId: userId,
      age: analysisData.age,
      gender: analysisData.gender,
      skinType: analysisData.skinType,
      scanType: 'skin',
      image_url: analysisData.cloudinaryUrl,
      public_id: analysisData.cloudinaryPublicId,
      originalFileName: analysisData.originalFileName,
      status: 'completed',
      createdAt: new Date().toISOString(),
    });

    // Step 2: Save the AI analysis result to 'skin_analyses' collection

    const skinAnalysisRef = await addDoc(collection(db, 'skin_analyses'), {
      scanId: scanRef.id,
      userId: userId,

      // User Details (for History card)
      userDetails: {
        age: analysisData.age,
        gender: analysisData.gender,
        skinType: analysisData.skinType
      },

      // Image Data (for History card)
      imageData: {
        cloudinaryUrl: analysisData.cloudinaryUrl,
        originalFileName: analysisData.originalFileName
      },

      // AI Analysis Data (for Modal)
      aiAnalysis: {
        response: analysisData.aiResponse,
        prompt: analysisData.prompt,
        modelUsed: 'gemini-1.5-flash'
      },

      // Metadata (for History card)
      metadata: {
        createdAt: new Date().toISOString(),
        status: 'completed'
      }
    });

    console.log('Scan saved with ID: ', scanRef.id);
    console.log('Skin analysis saved with ID: ', skinAnalysisRef.id);

    return {
      success: true,
      analysisId: skinAnalysisRef.id,
    };
  } catch (error) {
    console.error('Error saving skin analysis: ', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 Save hair analysis data based on the ER Diagram.
 Step 1: Creates a document in 'scans' collection.
 Step 2: Creates a document in 'hair_analyses' collection with denormalized data for History page.
 */
export const saveHairAnalysis = async (userId, analysisData) => {
  try {
    // Step 1: Save the initial scan details to 'scans' collection
    const scanRef = await addDoc(collection(db, 'scans'), {
      userId: userId,
      age: analysisData.age,
      gender: analysisData.gender,
      hairType: analysisData.hairType,
      scanType: 'hair',
      image_url: analysisData.cloudinaryUrl,
      public_id: analysisData.cloudinaryPublicId,
      originalFileName: analysisData.originalFileName,
      status: 'completed',
      createdAt: new Date().toISOString(),
    });

    // Step 2: Save the AI analysis result to 'hair_analyses' collection

    const hairAnalysisRef = await addDoc(collection(db, 'hair_analyses'), {
      scanId: scanRef.id,
      userId: userId,

      // User Details (for History card)
      userDetails: {
        age: analysisData.age,
        gender: analysisData.gender,
        hairType: analysisData.hairType
      },

      // Image Data (for History card)
      imageData: {
        cloudinaryUrl: analysisData.cloudinaryUrl,
        originalFileName: analysisData.originalFileName
      },

      // AI Analysis Data (for Modal)
      aiAnalysis: {
        response: analysisData.aiAnalysis, // yahan 'aiAnalysis' hai
        modelUsed: 'gemini-1.5-flash'
      },

      // Metadata (for History card)
      metadata: {
        createdAt: new Date().toISOString(),
        status: 'completed'
      }
    });

    console.log('Scan saved with ID: ', scanRef.id);
    console.log('Hair analysis saved with ID: ', hairAnalysisRef.id);

    return {
      success: true,
      analysisId: hairAnalysisRef.id,
    };
  } catch (error) {
    console.error('Error saving hair analysis: ', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * Get user's SKIN analysis history
 * (Fetches from the new 'skin_analyses' collection)
 */
export const getUserSkinAnalyses = async (userId) => {
  try {
    const q = query(
      collection(db, 'skin_analyses'),
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



    analyses.sort((a, b) => getDocDate(b) - getDocDate(a));

    return {
      success: true,
      analyses: analyses
    };
  } catch (error) {
    console.error('Error fetching skin analyses: ', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Get user's HAIR analysis history
 * (Fetches from the new 'hair_analyses' collection)
 */
export const getUserHairAnalyses = async (userId) => {
  try {
    const q = query(
      collection(db, 'hair_analyses'),
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

    // === SORT FIX ===

    analyses.sort((a, b) => getDocDate(b) - getDocDate(a));

    return {
      success: true,
      analyses: analyses
    };
  } catch (error) {
    console.error('Error fetching hair analyses: ', error);
    return {
      success: false,
      error: error.message
    };
  }
};


/**
 * === FOR YOUR HISTORY PAGE ===
 * Gets all analyses (skin and hair) for a user, combines, and sorts them.
 * Use this function in your /history page component.
 */
export const getCombinedAnalysisHistory = async (userId) => {
  try {
    const allAnalyses = [];

    // 1. Get Skin Analyses
    const skinResult = await getUserSkinAnalyses(userId);
    if (skinResult.success) {
      skinResult.analyses.forEach(analysis => {
        allAnalyses.push({ ...analysis, analysisType: 'skin' });
      });
    } else {

      console.error("Skin analysis fetch failed:", skinResult.error);
    }

    // 2. Get Hair Analyses
    const hairResult = await getUserHairAnalyses(userId);
    if (hairResult.success) {
      hairResult.analyses.forEach(analysis => {
        allAnalyses.push({ ...analysis, analysisType: 'hair' });
      });
    } else {

      console.error("Hair analysis fetch failed:", hairResult.error);
    }

    // 3. Sort all results together by date (newest first)
    // === SORT FIX ===

    allAnalyses.sort((a, b) => getDocDate(b) - getDocDate(a));

    return {
      success: true,
      analyses: allAnalyses
    };
  } catch (error) {
    console.error('Error fetching combined history: ', error);
    return {
      success: false,
      error: error.message
    };
  }
};


/**
 * Update skin analysis (e.g., add user feedback)
 */
export const updateSkinAnalysis = async (analysisId, updateData) => {
  try {
    const analysisRef = doc(db, 'skin_analyses', analysisId);
    await updateDoc(analysisRef, {
      ...updateData,
      'metadata.updatedAt': new Date().toISOString()
    });

    return {
      success: true,
      analysisId: analysisId
    };
  } catch (error) {
    console.error('Error updating skin analysis: ', error);
    return {
      success: false,
      error: error.message
    };
  }
};

export const deleteAnalysis = async (analysisId, analysisType, scanId) => {
  
  if (!analysisId || !analysisType || !scanId) {
    console.error("Missing IDs for deletion:", { analysisId, analysisType, scanId });
    return { success: false, error: "Missing required IDs to delete." };
  }

  try {
    // 1. Determine the correct analysis collection name
    const collectionName = analysisType === 'skin' ? 'skin_analyses' : 'hair_analyses';

    // 2. Create a reference to the specific analysis document using its ID
    const analysisRef = doc(db, collectionName, analysisId);

    // 3. Delete the analysis document from Firestore
    await deleteDoc(analysisRef);
    console.log(`Successfully deleted analysis document: ${collectionName}/${analysisId}`);

    // 4. Create a reference to the corresponding scan document using its ID
    const scanRef = doc(db, 'scans', scanId);

    // 5. Delete the scan document from Firestore
    await deleteDoc(scanRef);
    console.log(`Successfully deleted scan document: scans/${scanId}`);
    return { success: true };

  } catch (error) {

    console.error('Error deleting documents: ', error);
    return { success: false, error: error.message };
  }
};
