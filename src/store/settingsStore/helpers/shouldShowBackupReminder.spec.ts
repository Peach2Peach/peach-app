import { MSINAMONTH } from '../../../constants'
import { shouldShowBackupReminder } from './shouldShowBackupReminder'

jest.spyOn(Date, 'now').mockImplementation(() => 21000000000000)
describe('shouldShowBackupReminder', () => {
  it('should return false if no backup has ever been made', () => {
    expect(shouldShowBackupReminder(undefined, undefined)).toBe(false)
  })
  it('should return false if a backup has been made less than a month ago', () => {
    expect(shouldShowBackupReminder(Date.now() - 1000, undefined)).toBe(false)
    expect(shouldShowBackupReminder(undefined, Date.now() - 1000)).toBe(false)
  })
  it('should return true if no backup has been made in the last month', () => {
    expect(shouldShowBackupReminder(Date.now() - MSINAMONTH, undefined)).toBe(true)
    expect(shouldShowBackupReminder(undefined, Date.now() - MSINAMONTH)).toBe(true)
  })
})
