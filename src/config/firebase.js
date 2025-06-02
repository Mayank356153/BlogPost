import { initializeApp } from "firebase/app";
import {getFirestore}  from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyD_d5fjs0Y9WFj33DwpEb_gYNerOCHxoZ8",
  authDomain: "blogpost-1d42a.firebaseapp.com",
  projectId: "blogpost-1d42a",
  storageBucket: "blogpost-1d42a.firebasestorage.app",
  messagingSenderId: "942141846966",
  appId: "1:942141846966:web:53159d173a1ba0c4653d17"
};

const app=initializeApp(firebaseConfig)

const db=getFirestore(app)

export {db}


export default app;