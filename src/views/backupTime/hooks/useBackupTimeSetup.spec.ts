import { renderHook } from '@testing-library/react-hooks'
import { useNavigation, useRoute } from '../../../hooks'
import { useSettingsStore } from '../../../store/settingsStore'
import { isBackupMandatory } from '../../../utils/account'
import { useBackupTimeSetup } from './useBackupTimeSetup'

jest.mock('../../../hooks')
jest.mock('../../../store/settingsStore')
jest.mock('../../../utils/account')

describe('useBackupTimeSetup', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  it('should set isMandatory to true if all params are true', () => {
    ;(useRoute as jest.Mock).mockReturnValue({ params: {} })
    ;(useSettingsStore as jest.Mock).mockReturnValue({})
    ;(isBackupMandatory as jest.Mock).mockReturnValue(true)
    const { result } = renderHook(() => useBackupTimeSetup())

    expect(result.current.isMandatory).toBe(true)
  })

  it('should set isMandatory to false when lastFileBackupDate and lastSeedBackupDate are not null', () => {
    ;(useRoute as jest.Mock).mockReturnValue({ params: {} })
    ;(useSettingsStore as jest.Mock).mockReturnValue({ lastFileBackupDate: new Date(), lastSeedBackupDate: new Date() })
    ;(isBackupMandatory as jest.Mock).mockReturnValue(true)
    const { result } = renderHook(() => useBackupTimeSetup())

    expect(result.current.isMandatory).toBe(false)
  })

  it('should set isMandatory to false when isBackupMandatory returns false', () => {
    ;(useRoute as jest.Mock).mockReturnValue({ params: {} })
    ;(isBackupMandatory as jest.Mock).mockReturnValue(false)
    const { result } = renderHook(() => useBackupTimeSetup())

    expect(result.current.isMandatory).toBe(false)
  })

  it('should navigate to backups screen when goToBackups is called', () => {
    ;(useRoute as jest.Mock).mockReturnValue({ params: {} })
    const replaceMock = jest.fn()
    ;(useNavigation as jest.Mock).mockReturnValue({ replace: replaceMock })
    const { result } = renderHook(() => useBackupTimeSetup())

    result.current.goToBackups()

    expect(replaceMock).toHaveBeenCalledWith('backups')
  })

  it('should navigate to nextScreen when skip is called with nextScreen provided', () => {
    const replaceMock = jest.fn()
    ;(useNavigation as jest.Mock).mockReturnValue({ replace: replaceMock })
    ;(useRoute as jest.Mock).mockReturnValue({ params: { nextScreen: 'someScreen' } })
    const { result } = renderHook(() => useBackupTimeSetup())

    result.current.skip()

    expect(replaceMock).toHaveBeenCalledWith('someScreen', {})
  })

  it('should navigate to home screen when skip is called without nextScreen provided', () => {
    const replaceMock = jest.fn()
    ;(useNavigation as jest.Mock).mockReturnValue({ replace: replaceMock })
    ;(useRoute as jest.Mock).mockReturnValue({ params: {} })
    const { result } = renderHook(() => useBackupTimeSetup())

    result.current.skip()

    expect(replaceMock).toHaveBeenCalledWith('home')
  })
})
