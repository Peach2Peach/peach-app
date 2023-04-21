/* eslint-disable max-lines-per-function */
import { renderHook, waitFor } from '@testing-library/react-native'
import { sellOffer } from '../../../tests/unit/data/offerData'
import { QueryClientWrapper } from '../../../tests/unit/helpers/QueryClientWrapper'
import { defaultFundingStatus } from '../../utils/offer/constants'
import { useFundingStatus } from './useFundingStatus'

const apiError = { error: 'UNAUTHORIZED' }
const defaultFundingStatusResponse = { funding: defaultFundingStatus, userConfirmationRequired: false }
const inMempool = {
  funding: { ...defaultFundingStatusResponse, status: 'MEMPOOL' },
  userConfirmationRequired: true,
}

const getFundingStatusMock = jest.fn().mockResolvedValue([defaultFundingStatusResponse])
jest.mock('../../utils/peachAPI', () => ({
  getFundingStatus: () => getFundingStatusMock(),
}))

describe('useFundingStatus', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })
  it('fetches funding status from API', async () => {
    getFundingStatusMock.mockResolvedValueOnce([inMempool])

    const { result } = renderHook(useFundingStatus, {
      wrapper: QueryClientWrapper,
      initialProps: sellOffer.id,
    })

    expect(result.current).toEqual({
      fundingStatus: defaultFundingStatus,
      userConfirmationRequired: false,
      isLoading: true,
      error: null,
    })

    await waitFor(() => expect(result.current.isLoading).toBe(false))

    expect(result.current).toEqual({
      fundingStatus: inMempool.funding,
      userConfirmationRequired: inMempool.userConfirmationRequired,
      isLoading: false,
      error: null,
    })
  })
  it('returns default funding status if API does not return one', async () => {
    getFundingStatusMock.mockResolvedValueOnce([null, apiError])

    const { result } = renderHook(useFundingStatus, {
      wrapper: QueryClientWrapper,
      initialProps: sellOffer.id,
    })

    expect(result.current).toEqual({
      fundingStatus: defaultFundingStatus,
      userConfirmationRequired: false,
      isLoading: true,
      error: null,
    })

    await waitFor(() => expect(result.current.isLoading).toBe(false))

    expect(result.current).toEqual({
      fundingStatus: defaultFundingStatus,
      userConfirmationRequired: false,
      isLoading: false,
      error: new Error(apiError.error),
    })
  })
})
