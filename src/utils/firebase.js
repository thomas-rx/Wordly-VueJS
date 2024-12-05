import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'

/**
 * Firebase configuration object containing keys and identifiers for the Firebase project.
 *
 * @property {string} apiKey - The API key for the Firebase project, retrieved from environment variables.
 * @property {string} authDomain - The authentication domain for the Firebase project, retrieved from environment variables.
 * @property {string} projectId - The project ID for the Firebase project, retrieved from environment variables.
 * @property {string} storageBucket - The storage bucket for the Firebase project, retrieved from environment variables.
 * @property {string} messagingSenderId - The messaging sender ID for the Firebase project, retrieved from environment variables.
 * @property {string} appId - The app ID for the Firebase project, retrieved from environment variables.
 * @property {string} measurementId - The measurement ID for the Firebase project, retrieved from environment variables.
 */
const firebaseConfig = {
  apiKey: process.env.VUE_APP_FIREBASE_API_KEY,
  authDomain: process.env.VUE_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VUE_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VUE_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VUE_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VUE_APP_FIREBASE_APP_ID,
  measurementId: process.env.VUE_APP_FIREBASE_MEASUREMENT_ID,
}

const firebaseApp = initializeApp(firebaseConfig)
const firestore = getFirestore(firebaseApp)
const auth = getAuth(firebaseApp)

export { firebaseApp, firestore, auth }
