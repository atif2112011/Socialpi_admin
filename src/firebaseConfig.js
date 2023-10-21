// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"; //for firestore db

import { getStorage } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDK2gtQfdg2rOsFI4IclMrsPFNWnOgAMLQ",
  authDomain: "fir-frontend-8cae2.firebaseapp.com",
  projectId: "fir-frontend-8cae2",
  storageBucket: "fir-frontend-8cae2.appspot.com",
  messagingSenderId: "216896488992",
  appId: "1:216896488992:web:5c7ee4c13159c3056a1e45",
  measurementId: "G-Z0BR0XVBHW",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
//For firestore db
export const database = getFirestore(app);

export const storage = getStorage(app);
