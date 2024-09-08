// Import the functions you need from the SDKs you need
import {getFirebase, getFirestore} from "firebase/firestore";
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: FIREBASE_API,
  authDomain: "flashcard-a9f16.firebaseapp.com",
  projectId: "flashcard-a9f16",
  storageBucket: "flashcard-a9f16.appspot.com",
  messagingSenderId: "644320848989",
  appId: "1:644320848989:web:a6a5f883e911986ca9f1b4",
  measurementId: "G-1LY28V9RSJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
export {db};
