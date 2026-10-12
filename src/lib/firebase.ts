import { initializeApp } from "firebase/app";
import { getDatabase, type Database } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyC6VDFqCY56_XQ61y9pkwiOKWyb_zxmhng",
  authDomain: "project-1-90901.firebaseapp.com",
  databaseURL: "https://project-1-90901-default-rtdb.firebaseio.com",
  projectId: "project-1-90901",
  storageBucket: "project-1-90901.firebasestorage.app",
  messagingSenderId: "771139791732",
  appId: "1:771139791732:web:a3aa9489ad1fe19dc85a21",
};

const app = initializeApp(firebaseConfig);

let db: Database;
try {
  db = getDatabase(app);
} catch (err) {
  console.error("Failed to initialize Firebase Realtime Database:", err);
  throw err;
}

export { db };
