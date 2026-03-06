import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

// Your web app's Firebase configuration
// Replace these with your actual configuration details
const firebaseConfig = {
   apiKey: "AIzaSyA9agHFTA_20BWXMX5_VvQj_eJvILhoHe0",
  authDomain: "gede-1e198.firebaseapp.com",
  projectId: "gede-1e198",
  storageBucket: "gede-1e198.firebasestorage.app",
  messagingSenderId: "208287925390",
  appId: "1:208287925390:web:0be9527ea06532e9b0f5df",
  measurementId: "G-7NY5QEWGJK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const rtdb = getDatabase(app);
export default app;
