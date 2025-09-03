// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Replace with your Firebase project settings
const firebaseConfig = {
  apiKey: "AIzaSyDd_ba4vi8VplvbQR827El7WyA0hULSSQ0",
  authDomain: "property-investor-ap.firebaseapp.com",
  projectId: "property-investor-ap",
  storageBucket: "property-investor-ap.firebasestorage.app",
  messagingSenderId: "1023277999694",
  appId: "1:1023277999694:web:c6367ded0990663af1451f",
  measurementId: "G-HFLX86GCN0"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
