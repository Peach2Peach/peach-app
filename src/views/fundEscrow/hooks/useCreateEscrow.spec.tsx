import { renderHook, waitFor } from '@testing-library/react-native'
import { account1 } from '../../../../tests/unit/data/accountData'
import { sellOffer } from '../../../../tests/unit/data/offerData'
import { unauthorizedError } from '../../../../tests/unit/data/peachAPIData'
import { QueryClientWrapper } from '../../../../tests/unit/helpers/QueryClientWrapper'
import { updateAccount } from '../../../utils/account'
import { defaultFundingStatus } from '../../../utils/offer/constants'
import { useCreateEscrow } from './useCreateEscrow'

jest.useFakeTimers()

const createEscrowMock = jest.fn().mockResolvedValue([
  {
    offerId: sellOffer.id,
    escrow: 'escrow',
    funding: defaultFundingStatus,
  },
])
jest.mock('../../../utils/peachAPI', () => ({
  createEscrow: (...args: any[]) => createEscrowMock(...args),
}))

const showErrorBannerMock = jest.fn()
jest.mock('../../../hooks/useShowErrorBanner', () => ({
  useShowErrorBanner: () => showErrorBannerMock,
}))

describe('useCreateEscrow', () => {
  beforeEach(() => {
    updateAccount(account1, true)
  })
  it('sends API request to create escrow', async () => {
    const { result } = renderHook(useCreateEscrow, {
      wrapper: QueryClientWrapper,
      initialProps: { offerId: sellOffer.id },
    })
    result.current.mutate()
    await waitFor(() => expect(result.current.isLoading).toBeFalsy())
    expect(createEscrowMock).toHaveBeenCalledWith({
      offerId: sellOffer.id,
      publicKey: '029d3a758589d86eaeccb6bd50dd91b4846ec558bde201999c8e3dee203a892c57',
    })
  })
  it('shows error banner on API errors', async () => {
    createEscrowMock.mockResolvedValueOnce([null, unauthorizedError])
    const { result } = renderHook(useCreateEscrow, {
      wrapper: QueryClientWrapper,
      initialProps: { offerId: sellOffer.id },
    })
    result.current.mutate()
    await waitFor(() => expect(result.current.isLoading).toBeFalsy())
    expect(showErrorBannerMock).toHaveBeenCalledWith(unauthorizedError.error)
  })
})
