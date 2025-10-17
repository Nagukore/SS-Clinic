import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyArLWKJJAX6F5yKxbz8QV4oLNcH3wLfSUg",
  authDomain: "ss-clinic-e07db.firebaseapp.com",
  projectId: "ss-clinic-e07db",
  // Use the conventional storage bucket host (appspot) — adjust if your console shows a different value
  storageBucket: "ss-clinic-e07db.appspot.com",
  messagingSenderId: "429785345061",
  appId: "1:429785345061:web:6abe3ae9ebef6ccf7563cc",
  measurementId: "G-HMCQ62G56K",
};

// Prevent initializing the app multiple times in HMR/dev environments
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

export { db };
