import { act, renderHook, waitFor } from '@testing-library/react-native'
import { buyOffer, sellOffer } from '../../../../tests/unit/data/offerData'
import { queryClientWrapper } from '../../../../tests/unit/helpers/queryClientWrapper'
import { useMatchStore } from '../../../components/matches/store'
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
    const firstPage = Array(10)
      .fill('match')
      .map((match, index) => `${match}${index}`)
    const secondPage = ['match10']
    getMatchesMock.mockImplementation(({ page }: { page: number }) => {
      if (page === 0) {
        return Promise.resolve([{ matches: firstPage, remainingMatches: 1 }, null])
      }
      if (page === 1) {
        return Promise.resolve([{ matches: secondPage, remainingMatches: 0 }, null])
      }
      return Promise.resolve([{ matches: [], remainingMatches: 0 }, null])
    })

    const { result } = renderHook(useOfferMatches, {
      initialProps: 'newOfferId',
      wrapper: queryClientWrapper,
    })

    // initial render
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })
    expect(result.current.allMatches).toEqual(firstPage)

    // fetch next page
    expect(result.current.hasNextPage).toBe(true)
    await act(async () => {
      await result.current.fetchNextPage()
    })

    await waitFor(() => {
      expect(result.current.allMatches).toEqual([...firstPage, ...secondPage])
    })

    // refetch after 15 seconds
    act(() => {
      useMatchStore.setState({ currentPage: 1 })
    })
    jest.advanceTimersByTime(1000 * 15)

    await waitFor(() => {
      expect(result.current.data?.pageParams).toStrictEqual([undefined, 2])
    })

    expect(result.current.allMatches).toEqual(firstPage)
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
