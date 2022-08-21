// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
const firebaseConfig = {
  apiKey: "AIzaSyBa-YOQVMSXcD-ZMQvZssztDlbN7SEjP0g",
  authDomain: "directly-test.firebaseapp.com",
  projectId: "directly-test",
  storageBucket: "directly-test.appspot.com",
  messagingSenderId: "790630805421",
  appId: "1:790630805421:web:4074d1145e1ef65aa7bb24",
  measurementId: "G-Q0K8S6R56V"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
