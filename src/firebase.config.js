import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyD8_6171XC4mnT-ff-N2pOLHXJwa9JsvnI",
  authDomain: "investo-a4be7.firebaseapp.com",
  projectId: "investo-a4be7",
  storageBucket: "investo-a4be7.appspot.com",
  messagingSenderId: "827401643595",
  appId: "1:827401643595:web:12d87df35af099778f4fce",
  measurementId: "G-04LD44THVH",
};

export const firebaseApp = initializeApp(firebaseConfig);
export const firebaseAuth = getAuth(firebaseApp);
export const firebaseDB = getFirestore(firebaseApp);
export const analytics = getAnalytics(firebaseApp);
