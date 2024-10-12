// Import the functions you need from the SDKs you need
const { initializeApp } = require("firebase/app");
const {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} = require("firebase/auth");
const { getDatabase } = require("firebase/database");
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_API_KEY_FIREBASE,
  authDomain: "cheesenet-593a4.firebaseapp.com",
  databaseURL: process.env.NEXT_PUBLIC_DATABASE_URL,
  projectId: "cheesenet-593a4",
  storageBucket: "cheesenet-593a4.appspot.com",
  messagingSenderId: "807603139428",
  appId: "1:807603139428:web:3c96424b49c504541a4071",
  measurementId: "G-LS36XNH6HG",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);

export {
  database,
  auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
};
