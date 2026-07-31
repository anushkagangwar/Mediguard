importScripts("https://www.gstatic.com/firebasejs/10.13.2/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.13.2/firebase-messaging-compat.js");

firebase.initializeApp({
 apiKey: "AIzaSyDep_aJNr7GVEH2CeAsNvEmuLN8NnB7UB0",
  authDomain: "mediguard-5a3d7.firebaseapp.com",
  projectId: "mediguard-5a3d7",
  storageBucket: "mediguard-5a3d7.firebasestorage.app",
  
  messagingSenderId: "165229131848",
  appId: "1:165229131848:web:2f03bd4da355d7c26b007d",
  measurementId: "G-SX69SSLJPL"
});

const messaging = firebase.messaging();

