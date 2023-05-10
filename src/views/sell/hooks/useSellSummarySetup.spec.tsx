import { renderHook, waitFor } from '@testing-library/react-native'
import { NavigationWrapper } from '../../../../tests/unit/helpers/NavigationWrapper'
import { useHeaderState } from '../../../components/header/store'
import { PeachWallet } from '../../../utils/wallet/PeachWallet'
import { setPeachWallet } from '../../../utils/wallet/setWallet'
import { useSellSummarySetup } from './useSellSummarySetup'

describe('useSellSummarySetup', () => {
  beforeEach(() => {
    // @ts-ignore
    setPeachWallet(new PeachWallet())
    jest.clearAllMocks()
  })

  it('should set up header correctly', async () => {
    const { result } = renderHook(useSellSummarySetup, { wrapper: NavigationWrapper })
    expect(useHeaderState.getState().title).toBe('sell offer summary')
    await waitFor(() => expect(result.current.returnAddress).toBeDefined())
  })
})
