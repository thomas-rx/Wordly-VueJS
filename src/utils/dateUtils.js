import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
import { Timestamp } from 'firebase/firestore'
import 'dayjs/locale/fr'

dayjs.locale('fr')
dayjs.extend(duration)

/**
 * Convert a Firestore Timestamp or JavaScript Date to a `dayjs` object.
 * @param {Timestamp|Date|string|null} timestamp - The timestamp or date to convert.
 * @returns {dayjs.Dayjs|null} - The `dayjs` object or null if the input is invalid.
 */
export function toDayjs(timestamp) {
  if (!timestamp) return null
  return timestamp instanceof Timestamp
    ? dayjs(timestamp.toDate())
    : dayjs(timestamp)
}

/**
 * Format a date or timestamp to a readable title (e.g., "Monday, 01/01").
 * @param {Timestamp|Date|string|null} timestamp - The timestamp or date to format.
 * @returns {string} - The formatted title string.
 */
export function formatTitle(timestamp) {
  const date = toDayjs(timestamp)
  return date ? date.format('dddd, DD/MM') : 'Unknown Date'
}

/**
 * Format a date or timestamp to "DD/MM/YYYY".
 * @param {Timestamp|Date|string|null} timestamp - The timestamp or date to format.
 * @returns {string} - The formatted date string.
 */
export function formatDate(timestamp) {
  const date = toDayjs(timestamp)
  return date ? date.format('DD/MM/YYYY') : 'Unknown Date'
}

/**
 * Format a date or timestamp to include time (e.g., "DD/MM/YYYY HH:mm").
 * @param {Timestamp|Date|string|null} timestamp - The timestamp or date to format.
 * @returns {string} - The formatted date-time string.
 */
export function formatDateTime(timestamp) {
  const date = toDayjs(timestamp)
  return date ? date.format('DD/MM/YYYY HH:mm') : 'Unknown Date'
}

/**
 * Converts milliseconds to a human-readable format (hh:mm:ss).
 * @param {number} milliseconds - The total milliseconds to format.
 * @returns {string} The formatted time string.
 */
export function millisecondsToDayjs(milliseconds) {
  const durationObj = dayjs.duration(milliseconds, 'milliseconds')
  const hours = String(Math.floor(durationObj.asHours())).padStart(2, '0')
  const minutes = String(durationObj.minutes()).padStart(2, '0')
  const seconds = String(durationObj.seconds()).padStart(2, '0')
  return `${hours}:${minutes}:${seconds}`
}
