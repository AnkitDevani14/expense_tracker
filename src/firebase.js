// Firebase configuration and initialization
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCCngqNa5CAT4Zx3xWJn4WKBBuoiAQkO0Y",
  authDomain: "expense-tracker-001-18b7f.firebaseapp.com",
  databaseURL: "https://expense-tracker-001-18b7f-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "expense-tracker-001-18b7f",
  storageBucket: "expense-tracker-001-18b7f.firebasestorage.app",
  messagingSenderId: "781713815244",
  appId: "1:781713815244:web:f0dc71ecf010d72e1a3469",
  measurementId: "G-2BWKEXQ6QR"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { db, auth, googleProvider }; 