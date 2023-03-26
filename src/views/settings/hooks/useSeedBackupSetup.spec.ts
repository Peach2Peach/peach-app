import { act, renderHook } from '@testing-library/react-native'
import { useSettingsStore } from '../../../store/settingsStore'
import { useSeedBackupSetup } from './useSeedBackupSetup'

jest.mock('@react-navigation/native', () => ({
  useFocusEffect: jest.fn(),
}))
jest.mock('../../../hooks/useNavigation', () => ({
  useNavigation: jest.fn().mockReturnValue({
    navigate: jest.fn(),
  }),
}))
jest.mock('../../../store/settingsStore')

// eslint-disable-next-line max-lines-per-function
describe('useSeedBackupSetup', () => {
  const now = new Date('2020-01-01')
  const setShowBackupReminderMock = jest.fn()
  const setLastSeedBackupDateMock = jest.fn()

  beforeEach(() => {
    jest.useFakeTimers().setSystemTime(now)
    ;(useSettingsStore as jest.Mock).mockReturnValue([setShowBackupReminderMock, setLastSeedBackupDateMock, undefined])
  })
  afterEach(() => {
    jest.resetAllMocks()
  })
  it('returns default correct values', () => {
    const { result } = renderHook(useSeedBackupSetup)
    expect(result.current.checked).toBeFalsy()
    expect(result.current.toggleChecked).toBeInstanceOf(Function)
    expect(result.current.showNextScreen).toBeInstanceOf(Function)
    expect(result.current.currentScreenIndex).toBe(1)
    expect(result.current.goBackToStart).toBeInstanceOf(Function)
    expect(result.current.lastSeedBackupDate).not.toBeDefined()
    expect(result.current.getCurrentScreen().id).toBe('securityInfo')
  })
  it('returns start at lastSeedBackup if seedPhrase backup has been already made', () => {
    ;(useSettingsStore as jest.Mock).mockReturnValue([
      setShowBackupReminderMock,
      setLastSeedBackupDateMock,
      now.getTime(),
    ])

    const { result } = renderHook(useSeedBackupSetup)
    expect(result.current.currentScreenIndex).toBe(0)
    expect(result.current.getCurrentScreen().id).toBe('lastSeedBackup')
    expect(result.current.lastSeedBackupDate).toBe(now.getTime())
  })
  it('allows to toggle checked', () => {
    const { result } = renderHook(useSeedBackupSetup)
    act(() => {
      result.current.toggleChecked()
    })
    expect(result.current.checked).toBeTruthy()
  })
  it('cycles through the screens', () => {
    const { result } = renderHook(useSeedBackupSetup)
    act(() => {
      result.current.toggleChecked()
    })
    expect(result.current.checked).toBeTruthy()
    act(() => {
      result.current.showNextScreen()
    })
    expect(result.current.getCurrentScreen().id).toBe('twelveWords')
    act(() => {
      result.current.showNextScreen()
    })
    expect(result.current.getCurrentScreen().id).toBe('keepPhraseSecure')
    act(() => {
      result.current.showNextScreen()
    })
    expect(result.current.getCurrentScreen().id).toBe('lastSeedBackup')
    expect(result.current.checked).toBeFalsy()
  })
  it('updates last lastSeedBackupDate and sets showBackupReminder to false after keepPhraseSecure screen', () => {
    const { result } = renderHook(useSeedBackupSetup)
    expect(result.current.lastSeedBackupDate).not.toBeDefined()
    act(() => {
      result.current.showNextScreen()
    })
    act(() => {
      result.current.showNextScreen()
    })
    act(() => {
      result.current.showNextScreen()
    })
    expect(setLastSeedBackupDateMock).toHaveBeenCalledWith(now.getTime())
    expect(setShowBackupReminderMock).toHaveBeenCalledWith(false)
  })
})
