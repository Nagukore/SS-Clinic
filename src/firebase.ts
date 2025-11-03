// src/firebase.ts
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyArLWKJJAX6F5yKxbz8QV4oLNcH3wLfSUg",
  authDomain: "ss-clinic-e07db.firebaseapp.com",
  projectId: "ss-clinic-e07db",
  storageBucket: "ss-clinic-e07db.appspot.com",
  messagingSenderId: "429785345061",
  appId: "1:429785345061:web:6abe3ae9ebef6ccf7563cc",
  measurementId: "G-HMCQ62G56K",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app); // ✅ Add this
