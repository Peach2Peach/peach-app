import { act, renderHook, responseUtils, waitFor } from 'test-utils'
import { useMatchStore } from '../../../components/matches/store'
import { peachAPI } from '../../../utils/peachAPI'
import { useOfferMatches } from './useOfferMatches'

const getMatchesMock = jest.spyOn(peachAPI.private.offer, 'getMatches')

jest.useFakeTimers()

describe('useOfferMatches', () => {
  it('should return the matches for an offer', async () => {
    const { result } = renderHook(useOfferMatches, { initialProps: 'offerId' })
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })
    expect(result.current.allMatches).toEqual(['match'])
  })
  it('should not make a request if not enabled', () => {
    renderHook(() => useOfferMatches('offerId', false), {})

    expect(getMatchesMock).not.toHaveBeenCalled()
  })
  it('should refetch after 15 seconds', async () => {
    const { result } = renderHook(useOfferMatches, { initialProps: 'offerId' })
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
    // @ts-ignore this should be replaced with better match data
    getMatchesMock.mockImplementation(({ page }: { page?: number }) => {
      if (page === 0) {
        return Promise.resolve({ result: { matches: firstPage, nextPage: 1 }, ...responseUtils })
      }
      if (page === 1) {
        return Promise.resolve({ result: { matches: secondPage, nextPage: undefined }, ...responseUtils })
      }
      return Promise.resolve({ result: { matches: [], nextPage: undefined }, ...responseUtils })
    })

    const { result } = renderHook(useOfferMatches, { initialProps: 'newOfferId' })

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
  it('should not remove matches when the user stays on the second page for 15 seconds', async () => {
    const firstPage = Array(10)
      .fill('match')
      .map((match, index) => `${match}${index}`)
    const secondPage = ['match10']

    const { result } = renderHook(useOfferMatches, { initialProps: 'newOfferId' })

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    await act(async () => {
      await result.current.fetchNextPage()
    })

    await waitFor(() => {
      expect(result.current.allMatches).toEqual([...firstPage, ...secondPage])
    })

    act(() => {
      useMatchStore.setState({ currentPage: 1 })
    })
    await waitFor(() => {
      jest.advanceTimersByTime(1000 * 15)
    })

    expect(result.current.allMatches).toEqual([...firstPage, ...secondPage])
  })

  it('should return matches for a funded sell offer', async () => {
    // @ts-ignore this should be replaced with better match data
    getMatchesMock.mockImplementation((..._args) =>
      Promise.resolve({ result: { matches: ['match'], remainingMatches: 0 }, ...responseUtils }),
    )
    const { result } = renderHook(useOfferMatches, { initialProps: 'thirdOfferId' })
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })
    expect(result.current.allMatches).toEqual(['match'])
  })
  it('should apply sorting to the matches', async () => {
    const { result } = renderHook(useOfferMatches, { initialProps: 'offerId' })
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(getMatchesMock).toHaveBeenCalledWith(
      expect.objectContaining({
        sortBy: ['bestReputation'],
      }),
    )
  })
})
