import { act, renderHook, responseUtils, waitFor } from 'test-utils'
import { buyOffer } from '../../../../peach-api/src/testData/offers'
import { queryClient } from '../../../../tests/unit/helpers/QueryClientWrapper'
import { peachAPI } from '../../../utils/peachAPI'
import { useSearchSetup } from './useSearchSetup'

jest.mock('../../../hooks/useRoute', () => ({
  useRoute: () => ({
    params: {
      offerId: buyOffer.id,
    },
  }),
}))

const match: Partial<Match> = {
  offerId: '904',
  matched: false,
  matchedPrice: 0,
  meansOfPayment: buyOffer.meansOfPayment,
  prices: {
    EUR: 200,
  },
}

const getMatchesMock = jest
  .spyOn(peachAPI.private.offer, 'getMatches')
  // @ts-ignore mock implementation is not correct
  .mockResolvedValue({ result: { matches: [match], nextPage: undefined }, ...responseUtils })
jest.spyOn(peachAPI.private.offer, 'getOfferDetails').mockResolvedValue({ result: buyOffer, ...responseUtils })

jest.useFakeTimers()

describe('useSearchSetup', () => {
  beforeEach(() => {
    queryClient.clear()
  })

  it('should return defaults', async () => {
    const { result } = renderHook(useSearchSetup)
    await act(async () => {
      await waitFor(() => expect(queryClient.isFetching()).toBe(0))
    })
    expect(result.current).toEqual({ offer: buyOffer, hasMatches: true })
  })
  it('should load offer and matches', async () => {
    const { result } = renderHook(useSearchSetup)
    await act(async () => {
      await waitFor(() => expect(queryClient.isFetching()).toBe(0))
    })
    expect(result.current).toEqual({ offer: buyOffer, hasMatches: true })
  })

  it('should call get matches once', async () => {
    renderHook(useSearchSetup)
    await act(async () => {
      await waitFor(() => expect(queryClient.isFetching()).toBe(0))
    })

    expect(getMatchesMock).toHaveBeenCalledTimes(1)
  })
})
