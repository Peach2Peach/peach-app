import { renderHook } from '@testing-library/react-hooks'
import { useSettingsStore } from '../../../store/settingsStore'
import { usePasswordPromptSetup } from './usePasswordPromptSetup'

jest.mock('@react-navigation/native', () => ({
  useFocusEffect: jest.fn(),
}))
jest.mock('../../../hooks/useNavigation', () => ({
  useNavigation: jest.fn().mockReturnValue({
    navigate: jest.fn(),
  }),
}))
jest.mock('../../../store/settingsStore')

describe('usePasswordPromptSetup', () => {
  const setShowBackupReminderMock = jest.fn()
  const setLastFileBackupDateMock = jest.fn()

  beforeEach(() => {
    ;(useSettingsStore as jest.Mock).mockReturnValue([setShowBackupReminderMock, setLastFileBackupDateMock])
  })
  afterEach(() => {
    jest.resetAllMocks()
  })
  it('returns default correct values', () => {
    const { result } = renderHook(usePasswordPromptSetup)
    expect(result.current.setPassword).toBeInstanceOf(Function)
    expect(result.current.password).toBe('')
    expect(result.current.passwordIsValid).toBeFalsy()
    expect(result.current.passwordError).toHaveLength(2)
    expect(result.current.setPasswordRepeat).toBeInstanceOf(Function)
    expect(result.current.passwordRepeat).toBe('')
    expect(result.current.passwordRepeatIsValid).toBeFalsy()
    expect(result.current.passwordRepeatError).toHaveLength(2)
    expect(result.current.validate).toBeInstanceOf(Function)
    expect(result.current.startAccountBackup).toBeInstanceOf(Function)
  })
})
