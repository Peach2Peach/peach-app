import { act, renderHook, responseUtils, waitFor } from 'test-utils'
import { defaultUser } from '../../../../tests/unit/data/userData'
import { navigateMock } from '../../../../tests/unit/helpers/NavigationWrapper'
import { useOfferPreferences } from '../../../store/offerPreferenes'
import { useSettingsStore } from '../../../store/settingsStore'
import { peachAPI } from '../../../utils/peachAPI'
import { useBuySetup } from './useBuySetup'

const showHelpMock = jest.fn()
jest.mock('../../../hooks/useShowHelp', () => ({
  useShowHelp: () => showHelpMock,
}))

const mockIsBackupMandatory = jest.fn().mockReturnValue(false)
jest.mock('../../../utils/account', () => ({
  isBackupMandatory: () => mockIsBackupMandatory(),
}))

const getSelfUserMock = jest.spyOn(peachAPI.private.user, 'getSelfUser')

jest.useFakeTimers()

describe('useBuySetup', () => {
  beforeAll(() => {
    useSettingsStore.setState({ lastFileBackupDate: undefined, lastSeedBackupDate: undefined })
  })
  it('should return default values', () => {
    const { result } = renderHook(useBuySetup)
    expect(result.current).toEqual({
      freeTrades: 0,
      maxFreeTrades: 0,
      isLoading: true,
      next: expect.any(Function),
    })
  })
  it('should free trades from user', async () => {
    const freeTrades = 5
    const maxFreeTrades = 5
    getSelfUserMock.mockResolvedValueOnce({
      result: { ...defaultUser, freeTrades, maxFreeTrades },
      error: undefined,
      ...responseUtils,
    })
    const { result } = renderHook(useBuySetup)
    await waitFor(() => expect(result.current.freeTrades).toEqual(freeTrades))
    expect(result.current.freeTrades).toEqual(maxFreeTrades)
  })
  it('should return isLoading as true if minTradingAmount is 0', () => {
    const { result } = renderHook(useBuySetup)
    expect(result.current.isLoading).toBeTruthy()
  })
  it('should return isLoading as true if max buy amount is Infinity (default)', () => {
    useOfferPreferences.getState().setBuyAmountRange([0, Infinity])
    const { result } = renderHook(useBuySetup)
    expect(result.current.isLoading).toBeTruthy()
    act(() => useOfferPreferences.getState().setBuyAmountRange([100, 1000]))
    expect(result.current.isLoading).toBeFalsy()
  })
  it('should navigate to buyPreferences screen on next', () => {
    const { result } = renderHook(useBuySetup)
    result.current.next()
    expect(navigateMock).toHaveBeenCalledWith('buyPreferences')
  })
})
