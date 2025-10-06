// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCio4xJHaz6WJ3VM-ekH02b6K22jM8ABwc",
  authDomain: "glownexa-7688e.firebaseapp.com",
  projectId: "glownexa-7688e",
  storageBucket: "glownexa-7688e.firebasestorage.app",
  messagingSenderId: "811111965040",
  appId: "1:811111965040:web:a6ceb3392a9b2f428bafb5",
  measurementId: "G-ZYRWFVM2VC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const db = getFirestore(app);
