import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB5if_0B54F-kdGFaxL53PKfH5ObKohKns",
  authDomain: "rj-foods-f6994.firebaseapp.com",
  projectId: "rj-foods-f6994",
  storageBucket: "rj-foods-f6994.firebasestorage.app",
  messagingSenderId: "439927445054",
  appId: "1:439927445054:web:a69dc6095b3175dd58236f",
  measurementId: "G-H9Q965MLVS"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);