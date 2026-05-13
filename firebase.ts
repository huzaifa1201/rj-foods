import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyDsJfm7H4gTFvYFT3zM3OW5XqqXAHSymzY",
  authDomain: "foodieflow-b0df6.firebaseapp.com",
  projectId: "foodieflow-b0df6",
  storageBucket: "foodieflow-b0df6.firebasestorage.app",
  messagingSenderId: "622699555237",
  appId: "1:622699555237:web:1ce1f6b7e1d87376d1604c",
  measurementId: "G-WE828S3SJP"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;