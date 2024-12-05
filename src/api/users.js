import Cookies from 'js-cookie'
import { v4 as uuidv4 } from 'uuid'
import { nanoid } from 'nanoid'

const userApi = {
  /**
   * Retrieves the user information from cookies.
   *
   * @returns {Object} An object containing the user's id and username.
   * @returns {string|null} return.id - The user's id or null if not found.
   * @returns {string} return.username - The user's username or 'Guest' if not found.
   */
  getUser() {
    const id = Cookies.get('userId') || null
    const username = Cookies.get('username') || 'Guest'
    return { id, username }
  },

  /**
   * Sets the user ID and username in cookies.
   *
   * @param {string} id - The ID of the user.
   * @param {string} username - The username of the user.
   */
  setUser(id, username) {
    Cookies.set('userId', id)
    Cookies.set('username', username)
  },

  /**
   * Generates a new user with a unique ID and a randomly generated username.
   *
   * @returns {Object} An object containing the user's ID and username.
   * @returns {string} id - The unique identifier for the user.
   * @returns {string} username - The randomly generated username for the user.
   */
  generateNewUser() {
    const id = uuidv4()
    const username = `User_${nanoid(8)}`
    return { id, username }
  },
}

export default userApi
