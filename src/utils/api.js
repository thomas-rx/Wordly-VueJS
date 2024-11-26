import axios from 'axios'

const BASE_URL = env.BASE_URL

export async function getDailyWord() {
  const response = await axios.get(`${BASE_URL}/api/new-game`)
  return response.data
}

export async function checkWord(word) {
  const response = await axios.post(`${BASE_URL}/api/check-word`, {
    word,
  })
  return response.data
}
