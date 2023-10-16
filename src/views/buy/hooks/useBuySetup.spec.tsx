import { act, renderHook, waitFor } from 'test-utils'
import { defaultSelfUser } from '../../../../tests/unit/data/userData'
import { navigateMock } from '../../../../tests/unit/helpers/NavigationWrapper'
import { useOfferPreferences } from '../../../store/offerPreferenes'
import { useBuySetup } from './useBuySetup'

const useHeaderSetupMock = jest.fn()
jest.mock('../../../hooks/useHeaderSetup', () => ({
  useHeaderSetup: (...args: unknown[]) => useHeaderSetupMock(...args),
}))

const showHelpMock = jest.fn()
jest.mock('../../../hooks/useShowHelp', () => ({
  useShowHelp: () => showHelpMock,
}))

const useSettingsStoreMock = jest.fn((selector, _compareFn) =>
  selector({ lastFileBackupDate: null, lastSeedBackupDate: null }),
)
jest.mock('../../../store/settingsStore', () => ({
  useSettingsStore: (selector: unknown, compareFn: unknown) => useSettingsStoreMock(selector, compareFn),
}))

const mockIsBackupMandatory = jest.fn().mockReturnValue(false)
jest.mock('../../../utils/account', () => ({
  isBackupMandatory: () => mockIsBackupMandatory(),
}))

const getSelfUserMock = jest.fn().mockResolvedValue([defaultSelfUser, null])
jest.mock('../../../utils/peachAPI', () => ({
  getSelfUser: () => getSelfUserMock(),
}))

jest.useFakeTimers()

describe('useBuySetup', () => {
  it('should return default values', () => {
    const { result } = renderHook(useBuySetup)
    expect(result.current).toEqual({
      freeTrades: 0,
      maxFreeTrades: 0,
      isLoading: true,
      rangeIsValid: false,
      next: expect.any(Function),
    })
  })
  it('should free trades from user', async () => {
    const freeTrades = 5
    const maxFreeTrades = 5
    getSelfUserMock.mockResolvedValueOnce([{ ...defaultSelfUser, freeTrades, maxFreeTrades }, null])
    const { result } = renderHook(useBuySetup)
    await waitFor(() => expect(result.current.freeTrades).toEqual(freeTrades))
    expect(result.current.freeTrades).toEqual(maxFreeTrades)
  })
  it('should return isLoading as true if minTradingAmount is 0', () => {
    const { result } = renderHook(useBuySetup)
    expect(result.current.isLoading).toBeTruthy()
  })
  it('should return isLoading as true if max buy amount is Infinity (default)', () => {
    useOfferPreferences.getState().setBuyAmountRange([0, Infinity], { min: 0, max: Infinity })
    const { result } = renderHook(useBuySetup)
    expect(result.current.isLoading).toBeTruthy()
    act(() => useOfferPreferences.getState().setBuyAmountRange([100, 1000], { min: 100, max: 1000 }))
    expect(result.current.isLoading).toBeFalsy()
  })
  it('should return rangeIsValid as true if offer preferences allow it', () => {
    useOfferPreferences.getState().setBuyAmountRange([9, 101], { min: 10, max: 100 })
    const { result } = renderHook(useBuySetup)
    expect(result.current.rangeIsValid).toBeFalsy()
    act(() => useOfferPreferences.getState().setBuyAmountRange([10, 100], { min: 10, max: 100 }))
    expect(result.current.rangeIsValid).toBeTruthy()
  })
  it('should navigate to buyPreferences screen on next', () => {
    const { result } = renderHook(useBuySetup)
    result.current.next()
    expect(navigateMock).toHaveBeenCalledWith('buyPreferences')
  })
})
