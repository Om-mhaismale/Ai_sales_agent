// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAyAR11o_LY8wHj3pokfMU5B__7xCv6Li4",
  authDomain: "ai-sales-bot-ae7fd.firebaseapp.com",
  projectId: "ai-sales-bot-ae7fd",
  storageBucket: "ai-sales-bot-ae7fd.firebasestorage.app",
  messagingSenderId: "86425084416",
  appId: "1:86425084416:web:611dfa1721225485e6eee5",
  measurementId: "G-WN0G0DW94J",
  databaseURL: "https://ai-sales-bot-ae7fd-default-rtdb.firebaseio.com",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);