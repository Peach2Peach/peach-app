import { renderHook, waitFor } from '@testing-library/react-native'
import { NavigationWrapper } from '../../../../tests/unit/helpers/NavigationWrapper'
import { useHeaderState } from '../../../components/header/store'
import { PeachWallet } from '../../../utils/wallet/PeachWallet'
import { setPeachWallet } from '../../../utils/wallet/setWallet'
import { useSellSummarySetup } from './useSellSummarySetup'
import { settingsStore } from '../../../store/settingsStore'

describe('useSellSummarySetup', () => {
  beforeEach(() => {
    // @ts-ignore
    setPeachWallet(new PeachWallet())
    jest.clearAllMocks()
  })

  it('should set up header correctly', async () => {
    const { result } = renderHook(useSellSummarySetup, { wrapper: NavigationWrapper })
    expect(useHeaderState.getState().title).toBe('sell offer summary')
    expect(useHeaderState.getState().icons?.[0].id).toBe('wallet')
    await waitFor(() => expect(result.current.returnAddress).toBeDefined())
  })
  it('should enable peach wallet if no payout address is set', () => {
    settingsStore.getState().setPeachWalletActive(false)
    expect(settingsStore.getState().peachWalletActive).toBeFalsy()
    renderHook(useSellSummarySetup, { wrapper: NavigationWrapper })
    expect(settingsStore.getState().peachWalletActive).toBeTruthy()
  })
  it('should not enable peach wallet if payout address is set', () => {
    settingsStore.getState().setPeachWalletActive(false)
    settingsStore.getState().setPayoutAddress('payoutAddress')
    renderHook(useSellSummarySetup, { wrapper: NavigationWrapper })
    expect(settingsStore.getState().peachWalletActive).toBeFalsy()
  })
})
