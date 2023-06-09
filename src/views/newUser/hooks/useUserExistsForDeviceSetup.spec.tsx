import { renderHook } from '@testing-library/react-native'
import { NavigationWrapper, navigateMock } from '../../../../tests/unit/helpers/NavigationWrapper'
import { useUserExistsForDeviceSetup } from './useUserExistsForDeviceSetup'

const useRouteMock = jest.fn().mockReturnValue({
  params: {},
})
jest.mock('../../../hooks/useRoute', () => ({
  useRoute: () => useRouteMock(),
}))
describe('useUserExistsForDeviceSetup', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })
  it('should return navigation methods', async () => {
    const { result } = renderHook(useUserExistsForDeviceSetup, { wrapper: NavigationWrapper })
    expect(result.current).toEqual({
      goToRestoreFromFile: expect.any(Function),
      goToRestoreFromSeed: expect.any(Function),
      goToRestoreReputation: expect.any(Function),
    })
  })
  it('should navigate to restore from file', async () => {
    const { result } = renderHook(useUserExistsForDeviceSetup, { wrapper: NavigationWrapper })
    result.current.goToRestoreFromFile()
    expect(navigateMock).toHaveBeenCalledWith('restoreBackup', { tab: 'fileBackup' })
  })
  it('should navigate to restore from seed', async () => {
    const { result } = renderHook(useUserExistsForDeviceSetup, { wrapper: NavigationWrapper })
    result.current.goToRestoreFromSeed()
    expect(navigateMock).toHaveBeenCalledWith('restoreBackup', { tab: 'seedPhrase' })
  })
  it('should navigate to restore reputation', async () => {
    const { result } = renderHook(useUserExistsForDeviceSetup, { wrapper: NavigationWrapper })
    result.current.goToRestoreReputation()
    expect(navigateMock).toHaveBeenCalledWith('restoreReputation', {})
  })
  it('should navigate to restore reputation with params if set', async () => {
    const params = { referralCode: 'REFERRALCODE' }
    useRouteMock.mockReturnValueOnce({ params })
    const { result } = renderHook(useUserExistsForDeviceSetup, { wrapper: NavigationWrapper })
    result.current.goToRestoreReputation()
    expect(navigateMock).toHaveBeenCalledWith('restoreReputation', params)
  })
})
