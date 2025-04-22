import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyBnG0NZUi_XFyS90nfUzodBEF7qFPRgUlE",
  authDomain: "smart-cart-f3792.firebaseapp.com",
  projectId: "smart-cart-f3792",
  storageBucket: "smart-cart-f3792.firebasestorage.app",
  messagingSenderId: "179622716042",
  appId: "1:179622716042:web:680d0d4b881fb5892a0373",
  measurementId: "G-LKLB03SQ4L"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app)
const provider = new GoogleAuthProvider();

const analytics = getAnalytics(app);

export { auth, provider, analytics };