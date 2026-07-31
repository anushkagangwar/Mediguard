// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getMessaging } from "firebase/messaging";


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDep_aJNr7GVEH2CeAsNvEmuLN8NnB7UB0",
  authDomain: "mediguard-5a3d7.firebaseapp.com",
  projectId: "mediguard-5a3d7",
  storageBucket: "mediguard-5a3d7.appspot.com",
  messagingSenderId: "165229131848",
  appId: "1:165229131848:web:2f03bd4da355d7c26b007d",
  measurementId: "G-SX69SSLJPL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const messaging = getMessaging(app);

export default app;