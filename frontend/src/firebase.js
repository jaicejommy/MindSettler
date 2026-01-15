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
  sendPasswordResetEmail as firebaseSendPasswordResetEmail,
  confirmPasswordReset,
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
// Add Google Calendar scope for automatic calendar integration
googleProvider.addScope('https://www.googleapis.com/auth/calendar.events')

// Store Google access token for Calendar API
let googleAccessToken = null

export function getGoogleAccessToken() {
  return googleAccessToken
}

export function setGoogleAccessToken(token) {
  googleAccessToken = token
}

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
  // Store the Google access token for Calendar API
  const credential = GoogleAuthProvider.credentialFromResult(cred)
  if (credential?.accessToken) {
    googleAccessToken = credential.accessToken
  }
  return cred.user
}

export async function logout() {
  googleAccessToken = null
  await signOut(auth)
}

// Password reset using Firebase Auth
export async function sendPasswordReset(email) {
  await firebaseSendPasswordResetEmail(auth, email)
}


export async function confirmReset(oobCode, newPassword) {
  await confirmPasswordReset(auth, oobCode, newPassword)
}
