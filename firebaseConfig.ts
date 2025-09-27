// Import what you need from Firebase
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyCK6ww2u_JCQF7rDL0p8_yGc2rtMxedEhY",
  authDomain: "res4foodorder.firebaseapp.com",
  projectId: "res4foodorder",
  storageBucket: "res4foodorder.firebasestorage.app",
  messagingSenderId: "734981107115",
  appId: "1:734981107115:web:5ac114f90a5632d52736ee"
  // measurementId is optional, we can skip it
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);
