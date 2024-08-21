// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIRBASE_API_KEY,
  authDomain: "mern-blog-6fbfe.firebaseapp.com",
  projectId: "mern-blog-6fbfe",
  storageBucket: "mern-blog-6fbfe.appspot.com",
  messagingSenderId: "183674419228",
  appId: "1:183674419228:web:c3845de14b93f8c5b687d9"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);