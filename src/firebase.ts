// Import the necessary functions from the Firebase SDKs
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyArLWKJJAX6F5yKxbz8QV4oLNcH3wLfSUg",
  authDomain: "ss-clinic-e07db.firebaseapp.com",
  projectId: "ss-clinic-e07db",
  storageBucket: "ss-clinic-e07db.appspot.com",
  messagingSenderId: "429785345061",
  appId: "1:429785345061:web:6abe3ae9ebef6ccf7563cc",
  measurementId: "G-HMCQ62G56K"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and export it
// This is what you'll use in your components to interact with the database
export const db = getFirestore(app);