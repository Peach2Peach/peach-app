import { act, renderHook, waitFor } from '@testing-library/react-native'
import { buyOffer, sellOffer } from '../../../../tests/unit/data/offerData'
import { queryClientWrapper } from '../../../../tests/unit/helpers/queryClientWrapper'
import { useOfferMatches } from './useOfferMatches'

const getMatchesMock = jest.fn((...args) => Promise.resolve([{ matches: ['match'], remainingMatches: 0 }, null]))
const getOfferDetailsMock = jest.fn().mockResolvedValue([buyOffer, null])
jest.mock('../../../utils/peachAPI', () => ({
  getOfferDetails: () => getOfferDetailsMock(),
  getMatches: (...args: any) => getMatchesMock(...args),
}))

jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useIsFocused: jest.fn().mockReturnValue(true),
}))
jest.useFakeTimers()

describe('useOfferMatches', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })
  it('should return the matches for an offer', async () => {
    const { result } = renderHook(useOfferMatches, {
      initialProps: 'offerId',
      wrapper: queryClientWrapper,
    })
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })
    expect(result.current.allMatches).toEqual(['match'])
  })
  it('should refetch after 15 seconds', async () => {
    const { result } = renderHook(useOfferMatches, {
      initialProps: 'offerId',
      wrapper: queryClientWrapper,
    })
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })
    expect(result.current.allMatches).toEqual(['match'])
    jest.advanceTimersByTime(1000 * 15)
    expect(getMatchesMock).toHaveBeenCalledTimes(2)
    await waitFor(() => {
      expect(result.current.allMatches).toEqual(['match'])
    })
  })
  it('should not remove matches when the user gets to the next page', async () => {
    getMatchesMock.mockImplementation(
      ({ offerId, page, size, timeout }: { offerId: string; page: number; size: number; timeout: number }) => {
        if (page === 0) {
          return Promise.resolve([
            {
              offerId,
              matches: Array(size)
                .fill('match')
                .map((match, index) => `${match}${index}`),
              totalMatches: 11,
              remainingMatches: 1,
            },
            null,
          ])
        }
        if (page === 1) {
          return Promise.resolve([
            {
              offerId,
              matches: ['match10'],
              totalMatches: 11,
              remainingMatches: 0,
            },
            null,
          ])
        }
        return Promise.resolve([{ offerId, matches: [], totalMatches: 11, remainingMatches: 0 }, null])
      },
    )
    const firstPage = Array(10)
      .fill('match')
      .map((match, index) => `${match}${index}`)
    const secondPage = ['match10']
    const { result } = renderHook(useOfferMatches, {
      initialProps: 'newOfferId',
      wrapper: queryClientWrapper,
    })

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })
    expect(result.current.allMatches).toEqual(firstPage)

    expect(result.current.hasNextPage).toBe(true)
    await act(async () => {
      await result.current.fetchNextPage()
    })

    await waitFor(() => {
      expect(result.current.allMatches).toEqual([...firstPage, ...secondPage])
    })
  })
  it('should return matches for a funded sell offer', async () => {
    getMatchesMock.mockImplementation((...args) => Promise.resolve([{ matches: ['match'], remainingMatches: 0 }, null]))
    getOfferDetailsMock.mockResolvedValueOnce([
      {
        ...sellOffer,
        funding: { status: 'FUNDED' },
      },
      null,
    ])
    const { result } = renderHook(useOfferMatches, {
      initialProps: 'thirdOfferId',
      wrapper: queryClientWrapper,
    })
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })
    expect(result.current.allMatches).toEqual(['match'])
  })
})
