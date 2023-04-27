import { renderHook, waitFor } from '@testing-library/react-native'
import { account1 } from '../../../../tests/unit/data/accountData'
import { sellOffer } from '../../../../tests/unit/data/offerData'
import { QueryClientWrapper } from '../../../../tests/unit/helpers/QueryClientWrapper'
import { setAccount } from '../../../utils/account'
import { defaultFundingStatus } from '../../../utils/offer/constants'
import { useCreateEscrow } from './useCreateEscrow'

jest.useFakeTimers()

const apiError = { error: 'UNAUTHORIZED' }
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
  useShowErrorBanner:
    () =>
      (...args: any[]) =>
        showErrorBannerMock(...args),
}))

describe('useCreateEscrow', () => {
  beforeEach(async () => {
    await setAccount(account1)
  })
  afterEach(() => {
    jest.clearAllMocks()
  })
  it('sends API request to create escrow', async () => {
    const { result } = renderHook(useCreateEscrow, {
      wrapper: QueryClientWrapper,
      initialProps: { offerId: sellOffer.id },
    })
    await result.current.mutate()
    await waitFor(() => expect(result.current.isLoading).toBeFalsy())
    expect(createEscrowMock).toHaveBeenCalledWith({
      offerId: '38',
      publicKey: '03c2312751aae3cd2e9c4aa4086e009fca7f4fa75b3ec1c752ea7272cf86cb26a0',
    })
  })
  it('shows error banner on API errors', async () => {
    createEscrowMock.mockResolvedValueOnce([null, apiError])
    const { result } = renderHook(useCreateEscrow, {
      wrapper: QueryClientWrapper,
      initialProps: { offerId: sellOffer.id },
    })
    await result.current.mutate()
    await waitFor(() => expect(result.current.isLoading).toBeFalsy())
    expect(showErrorBannerMock).toHaveBeenCalledWith(apiError.error)
  })
})
