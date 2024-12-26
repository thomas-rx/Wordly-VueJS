import axios from 'axios'

const BASE_URL = process.env.VUE_APP_API_URL

/**
 * Fetches the daily word for the game.
 *
 * Makes an HTTP GET request to the `/api/new-game` endpoint to retrieve the daily word.
 *
 * @returns {Promise<Object>} A promise that resolves to the response data containing the daily word.
 * @throws {Error} If the request fails.
 */
export async function getDailyWord() {
  if (!BASE_URL) {
    throw new Error('API URL is not set')
  }
  try {
    const response = await axios.get(`${BASE_URL}/api/new-game`)
    console.debug('Called /api/new-game endpoint.')
    console.debug(response.data)
    return response.data.word
  } catch (error) {
    console.error('Erreur lors de la récupération du mot quotidien:', error)
    throw error
  }
}

/**
 * Checks if a given word is valid by making a POST request to the server.
 *
 * @param {string} word - The word to be checked.
 * @returns {Promise<Object>} The response data from the server.
 * @throws {Error} If the request fails.
 */
export async function checkWord(word) {
  if (!BASE_URL) {
    throw new Error('API URL is not set')
  }
  try {
    const response = await axios.post(`${BASE_URL}/api/check-word`, {
      word,
    })
    console.debug('Called /api/check-word endpoint with word:', word)
    console.debug(response.data)
    return response.data.isWord
  } catch (error) {
    console.error('Erreur lors de la vérification du mot:', error)
    throw error
  }
}
