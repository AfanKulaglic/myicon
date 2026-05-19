import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";

// Firebase Auth is used for customer accounts (email/password sign-in).
// Firebase Storage is NOT used — images are stored as base64 data URLs in RTDB.

const firebaseConfig = {
  apiKey: "AIzaSyBiB0JrNlcGQlGS4Jes49S8esX64OQR0hI",
  authDomain: "wlab-40444.firebaseapp.com",
  databaseURL: "https://wlab-40444-default-rtdb.firebaseio.com",
  projectId: "wlab-40444",
  storageBucket: "wlab-40444.appspot.com",
  messagingSenderId: "757040482083",
  appId: "1:757040482083:web:d8a661800b20790e5aee96",
};

const app = initializeApp(firebaseConfig);

export const rtdb = getDatabase(app);
export const auth = getAuth(app);
export default app;
