import { renderHook } from '@testing-library/react-native'
import { useBackupTimeSetup } from './useBackupTimeSetup'

const useRouteMock = jest.fn(() => ({ params: {} }))
const replaceMock = jest.fn()
const useNavigationMock = jest.fn(() => ({ replace: replaceMock }))
jest.mock('../../../hooks', () => ({
  useNavigation: () => useNavigationMock(),
  useRoute: () => useRouteMock(),
}))

const useSettingsStoreMock = jest.fn((selector, _compareFn) =>
  selector({ lastFileBackupDate: null, lastSeedBackupDate: null }),
)
jest.mock('../../../store/settingsStore', () => ({
  useSettingsStore: (selector: any, compareFn: any) => useSettingsStoreMock(selector, compareFn),
}))

const isBackupMandatoryMock = jest.fn(() => true)
jest.mock('../../../utils/account', () => ({
  isBackupMandatory: () => isBackupMandatoryMock(),
}))

describe('useBackupTimeSetup', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should return defaults', () => {
    const { result } = renderHook(useBackupTimeSetup)

    expect(result.current.goToBackups).toBeInstanceOf(Function)
    expect(result.current.skip).toBeInstanceOf(Function)
  })

  it('should navigate to backups screen when goToBackups is called', () => {
    const { result } = renderHook(useBackupTimeSetup)

    result.current.goToBackups()

    expect(replaceMock).toHaveBeenCalledWith('backups')
  })

  it('should navigate to nextScreen when skip is called with nextScreen provided', () => {
    useRouteMock.mockReturnValueOnce({ params: { nextScreen: 'someScreen' } })
    const { result } = renderHook(useBackupTimeSetup)

    result.current.skip()

    expect(replaceMock).toHaveBeenCalledWith('someScreen', {})
  })

  it('should navigate to home screen when skip is called without nextScreen provided', () => {
    const { result } = renderHook(useBackupTimeSetup)

    result.current.skip()

    expect(replaceMock).toHaveBeenCalledWith('home')
  })
})
