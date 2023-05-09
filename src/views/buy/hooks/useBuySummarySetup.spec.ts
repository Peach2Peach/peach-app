import { renderHook, waitFor } from '@testing-library/react-native'
import { NavigationWrapper } from '../../../../tests/unit/helpers/NavigationWrapper'
import { useHeaderState } from '../../../components/header/store'
import { useBuySummarySetup } from './useBuySummarySetup'
import { setPeachWallet } from '../../../utils/wallet/setWallet'
import { PeachWallet } from '../../../utils/wallet/PeachWallet'

describe('useBuySummarySetup', () => {
  beforeEach(() => {
    // @ts-ignore
    setPeachWallet(new PeachWallet())
    jest.clearAllMocks()
  })

  it('should set up header correctly', async () => {
    const { result } = renderHook(useBuySummarySetup, { wrapper: NavigationWrapper })
    expect(useHeaderState.getState().title).toBe('buy offer summary')
    expect(useHeaderState.getState().icons?.[0].id).toBe('wallet')
    await waitFor(() => expect(result.current.message).toBeDefined())
  })
})
