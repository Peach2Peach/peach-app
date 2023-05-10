import { renderHook, waitFor } from '@testing-library/react-native'
import { NavigationWrapper } from '../../../../tests/unit/helpers/NavigationWrapper'
import { useHeaderState } from '../../../components/header/store'
import { useBuySummarySetup } from './useBuySummarySetup'
import { setPeachWallet } from '../../../utils/wallet/setWallet'
import { PeachWallet } from '../../../utils/wallet/PeachWallet'
import { settingsStore } from '../../../store/settingsStore'

describe('useBuySummarySetup', () => {
  beforeEach(() => {
    // @ts-ignore
    setPeachWallet(new PeachWallet())
    jest.clearAllMocks()
  })

  it('should set up header correctly', async () => {
    const { result } = renderHook(useBuySummarySetup, { wrapper: NavigationWrapper })
    expect(useHeaderState.getState().title).toBe('publish buy offer')
    expect(useHeaderState.getState().icons?.[0].id).toBe('wallet')
    await waitFor(() => expect(result.current.message).toBeDefined())
  })
  it('should enable peach wallet if no payout address is set', () => {
    settingsStore.getState().setPeachWalletActive(false)
    expect(settingsStore.getState().peachWalletActive).toBeFalsy()
    renderHook(useBuySummarySetup, { wrapper: NavigationWrapper })
    expect(settingsStore.getState().peachWalletActive).toBeTruthy()
  })
  it('should not enable peach wallet if payout address is set', () => {
    settingsStore.getState().setPeachWalletActive(false)
    settingsStore.getState().setPayoutAddress('payoutAddress')
    renderHook(useBuySummarySetup, { wrapper: NavigationWrapper })
    expect(settingsStore.getState().peachWalletActive).toBeFalsy()
  })
})
