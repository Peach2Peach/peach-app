import { useShowBackupReminder } from './useShowBackupReminder'
import { renderHook } from '@testing-library/react-native'
import { useSettingsStore } from '../store/settingsStore'
import { MSINAMONTH } from '../constants'

const now = new Date('2021-07-12T13:00:00.000Z').valueOf()
jest.spyOn(global.Date, 'now').mockImplementation(() => now)
describe('useShowBackupReminder', () => {
  beforeEach(() => {
    useSettingsStore.setState({
      lastFileBackupDate: undefined,
      lastSeedBackupDate: undefined,
      showBackupReminder: false,
    })
  })

  it('should set showBackupReminder to true', () => {
    useSettingsStore.setState({
      lastFileBackupDate: now - MSINAMONTH,
    })
    renderHook(useShowBackupReminder)
    expect(useSettingsStore.getState().showBackupReminder).toBe(true)
  })

  it('should not set showBackupReminder to true if it is already true', () => {
    jest.spyOn(useSettingsStore.getState(), 'setShowBackupReminder')
    useSettingsStore.setState({
      lastFileBackupDate: now - MSINAMONTH,
      showBackupReminder: true,
    })
    renderHook(useShowBackupReminder)

    expect(useSettingsStore.getState().setShowBackupReminder).not.toHaveBeenCalled()
  })

  it('should not set showBackupReminder to true if there was a backup less than a month ago', () => {
    useSettingsStore.setState({
      lastFileBackupDate: now - MSINAMONTH + 1,
    })
    renderHook(useShowBackupReminder)
    expect(useSettingsStore.getState().showBackupReminder).toBe(false)
  })
})
