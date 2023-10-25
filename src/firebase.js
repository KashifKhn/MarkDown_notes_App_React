import { initializeApp } from "firebase/app";
import { collection, getFirestore } from 'firebase/firestore'

const firebaseConfig = {
    apiKey: "AIzaSyDkxUn4GMocrQNTGdzw8lvMDaQvW-6oRug",
    authDomain: "react-mark-down-notes.firebaseapp.com",
    projectId: "react-mark-down-notes",
    appId: "1:170738936225:web:8a255701076b7d366983e0",
    storageBucket: "react-mark-down-notes.appspot.com",
    messagingSenderId: "170738936225",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app)
export const notesCollection = collection(db, "notes")