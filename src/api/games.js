import {
  collection,
  doc,
  query,
  where,
  orderBy,
  onSnapshot,
  addDoc,
  serverTimestamp,
  getDocs,
  setDoc,
  getDoc,
  deleteDoc,
} from 'firebase/firestore'
import { firestore } from '@/utils/firebase'

const gamesApi = {
  async addGame(userId, username, gameData) {
    const gamesRef = collection(firestore, 'games')
    const gamePayload = {
      ...gameData,
      userId,
      username,
      date: serverTimestamp(),
    }

    const docRef = await addDoc(gamesRef, gamePayload)
    return { id: docRef.id, ...gamePayload }
  },

  /**
   * Subscribes to the games of a specific user and invokes a callback with the updated games data.
   *
   * @param {string} userId - The ID of the user whose games to subscribe to.
   * @param {function} callback - The callback function to be invoked with the updated games data.
   * @returns {function} Unsubscribe function to stop listening for updates.
   */
  subscribeToUserGames(userId, callback) {
    const gamesRef = collection(firestore, 'games')
    const q = query(
      gamesRef,
      where('userId', '==', userId),
      orderBy('date', 'desc'),
    )

    return onSnapshot(
      q,
      (snapshot) => {
        const games = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
        callback(games)
      },
      (error) => {
        console.error('Error subscribing to user games:', error)
      },
    )
  },

  /**
   * Fetches games for a specific user from the Firestore database.
   *
   * @param {string} userId - The ID of the user whose games are to be fetched.
   * @returns {Promise<Array<Object>>} A promise that resolves to an array of game objects.
   */
  async fetchGames(userId) {
    const gamesRef = collection(firestore, 'games')
    const q = query(
      gamesRef,
      where('userId', '==', userId),
      orderBy('date', 'desc'),
    )

    const snapshot = await getDocs(q)
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))
  },

  /**
   * Saves the current game state for a user to the Firestore database.
   *
   * @param {string} userId - The unique identifier of the user.
   * @param {Object} gameState - The current state of the game to be saved.
   * @returns {Promise<void>} A promise that resolves when the game state has been successfully saved.
   */
  async saveCurrentGame(userId, gameState) {
    const currentGameRef = doc(firestore, 'currentGames', userId)
    await setDoc(currentGameRef, {
      ...gameState,
      userId,
      date: serverTimestamp(),
    })
  },

  /**
   * Loads the current game data for a given user.
   *
   * @param {string} userId - The ID of the user whose current game data is to be loaded.
   * @returns {Promise<Object|null>} A promise that resolves to the current game data if it exists, or null if it does not.
   */
  async loadCurrentGame(userId) {
    const currentGameRef = doc(firestore, 'currentGames', userId)
    const docSnap = await getDoc(currentGameRef)
    if (docSnap.exists()) {
      return docSnap.data()
    } else {
      return null
    }
  },

  /**
   * Clears the current game for a given user by deleting the corresponding document in Firestore.
   *
   * @param {string} userId - The ID of the user whose current game should be cleared.
   * @returns {Promise<void>} A promise that resolves when the current game document is deleted.
   */
  async clearCurrentGame(userId) {
    const currentGameRef = doc(firestore, 'currentGames', userId)
    await deleteDoc(currentGameRef)
  },
}

export default gamesApi
