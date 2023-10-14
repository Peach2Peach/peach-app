import { renderHook, waitFor } from 'test-utils'
import { account1 } from '../../../../tests/unit/data/accountData'
import { unauthorizedError } from '../../../../tests/unit/data/peachAPIData'
import { updateAccount } from '../../../utils/account'
import { defaultFundingStatus } from '../../../utils/offer/constants'
import { useCreateEscrow } from './useCreateEscrow'

jest.useFakeTimers()

const createEscrowMock = jest.fn().mockResolvedValue([
  {
    offerId: '38',
    escrow: 'escrow',
    funding: defaultFundingStatus,
  },
])
jest.mock('../../../utils/peachAPI', () => ({
  createEscrow: (...args: unknown[]) => createEscrowMock(...args),
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
    const { result } = renderHook(useCreateEscrow, { initialProps: { offerIds: ['38'] } })
    result.current.mutate()
    await waitFor(() => expect(result.current.isLoading).toBeFalsy())
    expect(createEscrowMock).toHaveBeenCalledWith({
      offerId: '38',
      publicKey: '029d3a758589d86eaeccb6bd50dd91b4846ec558bde201999c8e3dee203a892c57',
    })
  })
  it('sends API requests to create multiple escrows', async () => {
    const { result } = renderHook(useCreateEscrow, { initialProps: { offerIds: ['38', '39'] } })
    result.current.mutate()
    await waitFor(() => expect(result.current.isLoading).toBeFalsy())
    expect(createEscrowMock).toHaveBeenCalledWith({
      offerId: '38',
      publicKey: '029d3a758589d86eaeccb6bd50dd91b4846ec558bde201999c8e3dee203a892c57',
    })
    expect(createEscrowMock).toHaveBeenCalledWith({
      offerId: '39',
      publicKey: '02290455989c5c5d4ba248a9f137ff83a6fb9961988cea868d8491e9f7e0447595',
    })
  })
  it('shows error banner on API errors', async () => {
    createEscrowMock.mockResolvedValueOnce([null, unauthorizedError])
    const { result } = renderHook(useCreateEscrow, { initialProps: { offerIds: ['38'] } })
    result.current.mutate()
    await waitFor(() => expect(result.current.isLoading).toBeFalsy())
    expect(showErrorBannerMock).toHaveBeenCalledWith(unauthorizedError.error)
  })
})
