/* eslint-disable max-lines-per-function */
import { renderHook, responseUtils, waitFor } from 'test-utils'
import { sellOffer } from '../../../peach-api/src/testData/offers'
import { queryClient } from '../../../tests/unit/helpers/QueryClientWrapper'
import { peachAPI } from '../../utils/peachAPI'
import { useMultipleOfferDetails, useOfferDetails } from './useOfferDetails'

const getStoredOfferMock = jest.fn()
jest.mock('../../utils/offer/getOffer', () => ({
  getOffer: () => getStoredOfferMock(),
}))
const getOfferDetailsMock = jest.spyOn(peachAPI.private.offer, 'getOfferDetails')

describe('useOfferDetails', () => {
  const localOffer = { ...sellOffer, refundTx: '1' }
  const localOfferUpToDate = { ...localOffer, lastModified: new Date() }
  afterEach(() => {
    queryClient.clear()
  })
  it('fetches offer details from API', async () => {
    const { result } = renderHook(useOfferDetails, { initialProps: sellOffer.id })

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
  it('returns local offer first if given and up to date', async () => {
    getStoredOfferMock.mockReturnValueOnce(localOfferUpToDate)
    const { result } = renderHook(useOfferDetails, { initialProps: sellOffer.id })

    expect(result.current).toEqual({
      offer: localOfferUpToDate,
      isLoading: false,
      isFetching: false,
      error: null,
    })

    await waitFor(() => expect(result.current.isFetching).toBe(false))

    expect(result.current.offer).toEqual(localOfferUpToDate)
  })
  it('returns local offer if given and server did not return result', async () => {
    getOfferDetailsMock.mockResolvedValueOnce(responseUtils)
    getStoredOfferMock.mockReturnValueOnce(localOffer)
    const { result } = renderHook(useOfferDetails, { initialProps: sellOffer.id })
    expect(result.current).toEqual({
      offer: localOffer,
      isLoading: false,
      isFetching: true,
      error: null,
    })

    await waitFor(() => expect(result.current.isFetching).toBe(false))

    expect(result.current.offer).toEqual(localOffer)
  })
  it('returns error if server did not return result and no local offers exists', async () => {
    getStoredOfferMock.mockReturnValueOnce(undefined)
    getOfferDetailsMock.mockResolvedValueOnce({ error: { error: 'UNAUTHORIZED' }, ...responseUtils })
    const { result } = renderHook(useOfferDetails, { initialProps: sellOffer.id })

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
      error: new Error('UNAUTHORIZED'),
    })
  })
  it('returns correct error if no local offers exists and server did not return result or error', async () => {
    const expectedError = new Error('NOT_FOUND')
    getStoredOfferMock.mockReturnValueOnce(undefined)
    getOfferDetailsMock.mockResolvedValueOnce(responseUtils)
    const { result } = renderHook(useOfferDetails, { initialProps: sellOffer.id })

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
      error: expectedError,
    })
  })
})

describe('useMultipleOfferDetails', () => {
  const localOffer = { ...sellOffer, refundTx: '1' }
  const localOfferUpToDate = { ...localOffer, lastModified: new Date() }
  afterEach(() => {
    queryClient.clear()
  })
  it('fetches offers details from API', async () => {
    const { result } = renderHook(useMultipleOfferDetails, {
      initialProps: [sellOffer.id],
    })

    expect(result.current).toEqual({
      offers: [undefined],
      isLoading: true,
      isFetching: true,
      errors: [null],
    })

    await waitFor(() => expect(result.current.isLoading).toBe(false))

    expect(result.current).toEqual({
      offers: [sellOffer],
      isLoading: false,
      isFetching: false,
      errors: [null],
    })
  })
  it('returns local offers first if given and up to date', async () => {
    getStoredOfferMock.mockReturnValueOnce(localOfferUpToDate)
    const { result } = renderHook(useMultipleOfferDetails, {
      initialProps: [sellOffer.id],
    })

    expect(result.current).toEqual({
      offers: [localOfferUpToDate],
      isLoading: false,
      isFetching: false,
      errors: [null],
    })

    await waitFor(() => expect(result.current.isFetching).toBe(false))

    expect(result.current.offers).toEqual([localOfferUpToDate])
  })
  it('returns local offers if given and server did not return result', async () => {
    getOfferDetailsMock.mockResolvedValueOnce(responseUtils)
    getStoredOfferMock.mockReturnValueOnce(localOffer)
    const { result } = renderHook(useMultipleOfferDetails, {
      initialProps: [sellOffer.id],
    })
    expect(result.current).toEqual({
      offers: [localOffer],
      isLoading: false,
      isFetching: true,
      errors: [null],
    })

    await waitFor(() => expect(result.current.isFetching).toBe(false))

    expect(result.current.offers).toEqual([localOffer])
  })
  it('returns errors if server did not return result and no local offers exist', async () => {
    getStoredOfferMock.mockReturnValueOnce(undefined)
    getOfferDetailsMock.mockResolvedValueOnce({ error: { error: 'UNAUTHORIZED' }, ...responseUtils })
    const { result } = renderHook(useMultipleOfferDetails, {
      initialProps: [sellOffer.id],
    })

    expect(result.current).toEqual({
      offers: [undefined],
      isLoading: true,
      isFetching: true,
      errors: [null],
    })

    await waitFor(() => expect(result.current.isLoading).toBe(false))

    expect(result.current).toEqual({
      offers: [undefined],
      isLoading: false,
      isFetching: false,
      errors: [new Error('UNAUTHORIZED')],
    })
  })
  it('returns correct errors if no local offers exist and server did not return result or error', async () => {
    const expectedError = new Error('NOT_FOUND')
    getStoredOfferMock.mockReturnValueOnce(undefined)
    getOfferDetailsMock.mockResolvedValueOnce(responseUtils)
    const { result } = renderHook(useMultipleOfferDetails, {
      initialProps: [sellOffer.id],
    })

    expect(result.current).toEqual({
      offers: [undefined],
      isLoading: true,
      isFetching: true,
      errors: [null],
    })

    await waitFor(() => expect(result.current.isLoading).toBe(false))

    expect(result.current).toEqual({
      offers: [undefined],
      isLoading: false,
      isFetching: false,
      errors: [expectedError],
    })
  })
})
