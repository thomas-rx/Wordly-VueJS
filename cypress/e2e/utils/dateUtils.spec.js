import {
  toDayjs,
  formatTitle,
  formatDate,
  millisecondsToDayjs,
} from '@/utils/dateUtils'
import dayjs from 'dayjs'

describe('Testing dateUtils.js functions', () => {
  it('Converts Firestore Timestamp to dayjs object (toDayjs)', () => {
    const timestamp = dayjs().toDate()
    const result = toDayjs(timestamp)
    expect(result.isValid()).to.be.true
  })

  it('Formats date to readable title (formatTitle)', () => {
    const date = new Date('2024-11-27T00:00:00Z')
    const result = formatTitle(date)
    expect(result).to.equal('mercredi, 27/11')
  })

  it('Formats date to DD/MM/YYYY (formatDate)', () => {
    const date = new Date('2024-11-27T00:00:00Z')
    const result = formatDate(date)
    expect(result).to.equal('27/11/2024')
  })

  it('Converts seconds to human-readable format (millisecondsToDayjs)', () => {
    const seconds = 3661 // 1 hour, 1 minute, 1 second
    const result = millisecondsToDayjs(seconds)
    expect(result).to.equal('01:01:01')
  })
})
