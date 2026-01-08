// src/firebase.js
// Firebase initialization and email/password helpers

import { initializeApp } from 'firebase/app'
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth'

// TODO: replace these placeholder values with your actual Firebase project config
// from Firebase Console -> Project settings -> General -> Your apps -> Web app
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'YOUR_API_KEY',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'YOUR_AUTH_DOMAIN',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'YOUR_PROJECT_ID',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || 'YOUR_APP_ID',
}

const app = initializeApp(firebaseConfig)

export const auth = getAuth(app)
const googleProvider = new GoogleAuthProvider()

export function listenToAuthChanges(callback) {
  // Small helper to subscribe to auth state changes and clean up
  return onAuthStateChanged(auth, callback)
}

export async function signUpWithEmailPassword(email, password) {
  const cred = await createUserWithEmailAndPassword(auth, email, password)
  return cred.user
}

export async function signInWithEmailPassword(email, password) {
  const cred = await signInWithEmailAndPassword(auth, email, password)
  return cred.user
}

export async function signInWithGoogle() {
  const cred = await signInWithPopup(auth, googleProvider)
  return cred.user
}

export async function logout() {
  await signOut(auth)
}
