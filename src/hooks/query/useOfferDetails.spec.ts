/* eslint-disable max-lines-per-function */
import { renderHook, waitFor } from '@testing-library/react-native'
import { sellOffer } from '../../../tests/unit/data/offerData'
import { QueryClientWrapper } from '../../../tests/unit/helpers/QueryClientWrapper'
import { useOfferDetails } from './useOfferDetails'

const apiError = { error: 'UNAUTHORIZED' }
const getStoredOfferMock = jest.fn()
jest.mock('../../utils/offer/getOffer', () => ({
  getOffer: () => getStoredOfferMock(),
}))
const getOfferDetailsMock = jest.fn().mockResolvedValue([sellOffer])
jest.mock('../../utils/peachAPI', () => ({
  getOfferDetails: () => getOfferDetailsMock(),
}))

describe('useOfferDetails', () => {
  const localOffer = { ...sellOffer, refundTx: '1' }

  afterEach(() => {
    jest.clearAllMocks()
  })
  it('fetches offer details from API', async () => {
    const { result } = renderHook(useOfferDetails, {
      wrapper: QueryClientWrapper,
      initialProps: sellOffer.id,
    })

    expect(result.current).toEqual({
      offer: undefined,
      isLoading: true,
      isFetching: true,
      error: null,
    })

    await waitFor(() => expect(result.current.isLoading).toBe(false))

    expect(result.current).toEqual({
      offer: sellOffer,
      isLoading: false,
      isFetching: false,
      error: null,
    })
  })
  it('returns local offer first if given', async () => {
    getStoredOfferMock.mockReturnValueOnce(localOffer)
    const { result } = renderHook(useOfferDetails, {
      wrapper: QueryClientWrapper,
      initialProps: sellOffer.id,
    })

    expect(result.current).toEqual({
      offer: localOffer,
      isLoading: false,
      isFetching: true,
      error: null,
    })

    await waitFor(() => expect(result.current.isFetching).toBe(false))

    expect(result.current.offer).toEqual(sellOffer)
  })
  it('returns local offer if given and server did not return result', async () => {
    getOfferDetailsMock.mockResolvedValueOnce([null])
    getStoredOfferMock.mockReturnValueOnce(localOffer)
    const { result } = renderHook(useOfferDetails, {
      wrapper: QueryClientWrapper,
      initialProps: sellOffer.id,
    })
    expect(result.current).toEqual({
      offer: localOffer,
      isLoading: false,
      isFetching: true,
      error: null,
    })

    await waitFor(() => expect(result.current.isFetching).toBe(false))

    expect(result.current.offer).toEqual(localOffer)
  })
  it('returns error if server did not return result and no local contract exists', async () => {
    getStoredOfferMock.mockReturnValueOnce(undefined)
    getOfferDetailsMock.mockResolvedValueOnce([null, apiError])
    const { result } = renderHook(useOfferDetails, {
      wrapper: QueryClientWrapper,
      initialProps: sellOffer.id,
    })

    expect(result.current).toEqual({
      offer: undefined,
      isLoading: true,
      isFetching: true,
      error: null,
    })

    await waitFor(() => expect(result.current.isLoading).toBe(false))

    expect(result.current).toEqual({
      offer: undefined,
      isLoading: false,
      isFetching: false,
      error: new Error(apiError.error),
    })
  })
})
