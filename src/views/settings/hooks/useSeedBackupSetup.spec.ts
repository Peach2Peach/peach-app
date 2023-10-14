import { act, renderHook } from 'test-utils'
import { headerState } from '../../../../tests/unit/helpers/NavigationWrapper'
import { useSettingsStore } from '../../../store/settingsStore'
import { useSeedBackupSetup } from './useSeedBackupSetup'

jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useFocusEffect: (callback: Function) => callback(),
}))

// eslint-disable-next-line max-lines-per-function
describe('useSeedBackupSetup', () => {
  const now = new Date('2020-01-01')

  beforeEach(() => {
    jest.useFakeTimers().setSystemTime(now)
    useSettingsStore.setState({
      lastSeedBackupDate: undefined,
    })
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

  it('should set up header correctly', () => {
    renderHook(useSeedBackupSetup)
    expect(headerState.header()).toMatchSnapshot()
  })

  it('returns start at lastSeedBackup if seedPhrase backup has been already made', () => {
    useSettingsStore.setState({
      lastSeedBackupDate: now.getTime(),
    })
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
    expect(useSettingsStore.getState().lastSeedBackupDate).toBe(now.getTime())
    expect(useSettingsStore.getState().showBackupReminder).toBeFalsy()
  })
})
