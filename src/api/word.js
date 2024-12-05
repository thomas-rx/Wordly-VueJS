import axios from 'axios'

const BASE_URL = env.BASE_URL

/**
 * Fetches the daily word for the game.
 *
 * Makes an HTTP GET request to the `/api/new-game` endpoint to retrieve the daily word.
 *
 * @returns {Promise<Object>} A promise that resolves to the response data containing the daily word.
 * @throws {Error} If the request fails.
 */
export async function getDailyWord() {
  const response = await axios.get(`${BASE_URL}/api/new-game`)
  return response.data
}

/**
 * Checks if a given word is valid by making a POST request to the server.
 *
 * @param {string} word - The word to be checked.
 * @returns {Promise<Object>} The response data from the server.
 * @throws {Error} If the request fails.
 */
export async function checkWord(word) {
  const response = await axios.post(`${BASE_URL}/api/check-word`, {
    word,
  })
  return response.data
}
