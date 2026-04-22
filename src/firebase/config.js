// src/firebase/config.js
// Substitua pelos seus dados do Firebase Console
import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyAV-l08jrFh-CbDNnOvucYJepcVTOPUrHg",
  authDomain: "entregalaxias369.firebaseapp.com",
  projectId: "entregalaxias369",
  storageBucket: "entregalaxias369.firebasestorage.app",
  messagingSenderId: "1042139733115",
  appId: "1:1042139733115:web:27db1af4e44e07321f56de",
  measurementId: "G-HH07FG84JD"
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)
