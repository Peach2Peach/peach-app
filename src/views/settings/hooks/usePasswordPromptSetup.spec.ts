import { Keyboard } from 'react-native'
import { act, renderHook } from 'test-utils'
import { headerState, navigateMock } from '../../../../tests/unit/helpers/NavigationWrapper'
import { useSettingsStore } from '../../../store/settingsStore'
import { usePasswordPromptSetup } from './usePasswordPromptSetup'

const backupAccountMock = jest.fn()
jest.mock('../../../utils/account', () => ({
  backupAccount: (...args: unknown[]) => backupAccountMock(...args),
}))
const onSuccessMock = jest.fn()

const password = 'password'
const passwordRepeat = 'password'
describe('usePasswordPromptSetup', () => {
  it('returns default correct values', () => {
    const { result } = renderHook(usePasswordPromptSetup, { initialProps: onSuccessMock })
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
  it('should set up header correctly', () => {
    renderHook(usePasswordPromptSetup, { initialProps: onSuccessMock })
    expect(headerState.header()).toMatchSnapshot()
  })
  it('should set the password', () => {
    const { result } = renderHook(usePasswordPromptSetup, { initialProps: onSuccessMock })
    act(() => {
      result.current.setPassword(password)
    })
    expect(result.current.password).toBe(password)
  })

  it('should set the password repeat', () => {
    const { result } = renderHook(usePasswordPromptSetup, { initialProps: onSuccessMock })
    act(() => {
      result.current.setPasswordRepeat(passwordRepeat)
    })
    expect(result.current.passwordRepeat).toBe(passwordRepeat)
  })

  it('should validate the passwords', () => {
    const { result } = renderHook(usePasswordPromptSetup, { initialProps: onSuccessMock })
    act(() => {
      result.current.setPassword(password)
      result.current.setPasswordRepeat(passwordRepeat)
    })

    expect(result.current.validate()).toBeTruthy()
  })
})

// eslint-disable-next-line max-lines-per-function
describe('startAccountBackup', () => {
  it('should not start backup when passwords are not valid', () => {
    const keyboardSpy = jest.spyOn(Keyboard, 'dismiss')
    const { result } = renderHook(usePasswordPromptSetup, { initialProps: onSuccessMock })
    act(() => {
      result.current.startAccountBackup()
    })

    expect(keyboardSpy).not.toHaveBeenCalled()
  })
  it('should dismiss keyboard when passwords are valid', () => {
    const keyboardSpy = jest.spyOn(Keyboard, 'dismiss')
    const { result } = renderHook(usePasswordPromptSetup, { initialProps: onSuccessMock })
    act(() => {
      result.current.setPassword(password)
      result.current.setPasswordRepeat(passwordRepeat)
    })
    act(() => {
      result.current.startAccountBackup()
    })

    expect(keyboardSpy).toHaveBeenCalled()
  })

  it('should set the last file backup date to now', () => {
    const now = new Date('2021-01-01')
    jest.spyOn(Date, 'now').mockImplementationOnce(() => now.getTime())
    const { result } = renderHook(usePasswordPromptSetup, { initialProps: onSuccessMock })
    act(() => {
      result.current.setPassword(password)
      result.current.setPasswordRepeat(passwordRepeat)
    })
    act(() => {
      result.current.startAccountBackup()
    })

    expect(useSettingsStore.getState().lastFileBackupDate).toBe(now.getTime())
  })

  it('should set the show backup reminder to false', () => {
    const { result } = renderHook(usePasswordPromptSetup, { initialProps: onSuccessMock })
    act(() => {
      result.current.setPassword(password)
      result.current.setPasswordRepeat(passwordRepeat)
    })
    act(() => {
      result.current.startAccountBackup()
    })

    expect(useSettingsStore.getState().showBackupReminder).toBeFalsy()
  })

  it('should call backupAccount with the password', () => {
    const { result } = renderHook(usePasswordPromptSetup, { initialProps: onSuccessMock })
    act(() => {
      result.current.setPassword(password)
      result.current.setPasswordRepeat(passwordRepeat)
    })
    act(() => {
      result.current.startAccountBackup()
    })

    expect(backupAccountMock).toHaveBeenCalled()
    expect(backupAccountMock).toHaveBeenCalledWith(expect.objectContaining({ password }))
  })

  it('should handle a successful backup', () => {
    backupAccountMock.mockImplementationOnce(({ onSuccess }) => onSuccess())
    const { result } = renderHook(usePasswordPromptSetup, { initialProps: onSuccessMock })
    act(() => {
      result.current.setPassword(password)
      result.current.setPasswordRepeat(passwordRepeat)
    })
    act(() => {
      result.current.startAccountBackup()
    })

    expect(onSuccessMock).toHaveBeenCalled()
    expect(navigateMock).toHaveBeenCalledWith('backupCreated')
  })

  it('should handle a failed backup', () => {
    backupAccountMock.mockImplementationOnce(({ onError }) => onError())
    const { result } = renderHook(usePasswordPromptSetup, { initialProps: onSuccessMock })
    act(() => {
      result.current.setPassword(password)
      result.current.setPasswordRepeat(passwordRepeat)
    })
    act(() => {
      result.current.startAccountBackup()
    })

    expect(onSuccessMock).not.toHaveBeenCalled()
    expect(navigateMock).not.toHaveBeenCalledWith('backupCreated')
  })

  it('should handle a cancelled backup', () => {
    backupAccountMock.mockImplementationOnce(({ onCancel }) => onCancel())
    const { result } = renderHook(usePasswordPromptSetup, { initialProps: onSuccessMock })
    act(() => {
      result.current.setPassword(password)
      result.current.setPasswordRepeat(passwordRepeat)
    })
    act(() => {
      result.current.startAccountBackup()
    })

    expect(onSuccessMock).not.toHaveBeenCalled()
    expect(navigateMock).not.toHaveBeenCalledWith('backupCreated')
  })
})
