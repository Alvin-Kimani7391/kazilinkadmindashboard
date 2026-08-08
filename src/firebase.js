// firebase.js

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getDataConnect } from "firebase/data-connect";

const firebaseConfig = {
  apiKey: "AIzaSyD3Lae8X2TXELKpLml6z642FMVk6FOuImM",
  authDomain: "kazi-connect-e7856.firebaseapp.com",
  projectId: "kazi-connect-e7856",
  storageBucket: "kazi-connect-e7856.firebasestorage.app",
  messagingSenderId: "947309718023",
  appId: "1:947309718023:web:81d9ac0735404f992b58a2",
  measurementId: "G-W9EPJ9VFCG"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);

// Initialize Data Connect pointing to production
export const dataConnect = getDataConnect(app, {
  location: "europe-north1",
  service: "kazi-connect-e7856-service",
  connector: "admin"
});

// ⚠️ COMMENT OUT or REMOVE the emulator connection:
// if (import.meta.env.DEV) {
//   connectDataConnectEmulator(dataConnect, "localhost", 9399);
// }

export default app;