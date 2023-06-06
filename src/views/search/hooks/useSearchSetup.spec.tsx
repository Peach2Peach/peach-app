import { act, renderHook, waitFor } from '@testing-library/react-native'
import { buyOffer } from '../../../../tests/unit/data/offerData'
import { headerState, NavigationWrapper } from '../../../../tests/unit/helpers/NavigationWrapper'
import { QueryClientWrapper, queryClient } from '../../../../tests/unit/helpers/QueryClientWrapper'
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

const getMatchesMock = jest.fn().mockResolvedValue([{ matches: [match], nextPage: undefined }, null])
const getOfferDetailsMock = jest.fn().mockResolvedValue([buyOffer, null])
jest.mock('../../../utils/peachAPI', () => ({
  getMatches: (...args: any[]) => getMatchesMock(...args),
  getOfferDetails: (...args: any[]) => getOfferDetailsMock(...args),
}))

const wrapper = ({ children }: ComponentProps) => (
  <NavigationWrapper>
    <QueryClientWrapper>{children}</QueryClientWrapper>
  </NavigationWrapper>
)

jest.useFakeTimers()

describe('useSearchSetup', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should set up header correctly', async () => {
    const { result } = renderHook(useSearchSetup, { wrapper })

    await waitFor(() => expect(result.current.offer).toBeDefined())
    expect(headerState.header()).toMatchSnapshot()
  })
  it('should return defaults', async () => {
    const { result } = renderHook(useSearchSetup, { wrapper })
    expect(result.current).toEqual({ offer: buyOffer, hasMatches: true })
    await act(async () => {
      await waitFor(() => expect(queryClient.isFetching()).toBe(0))
    })
  })
  it('should load offer and matches', async () => {
    const { result } = renderHook(useSearchSetup, { wrapper })
    await waitFor(() => expect(result.current.offer).toBeDefined())
    expect(result.current).toEqual({ offer: buyOffer, hasMatches: true })
  })

  it('should call get matches once', async () => {
    const { result } = renderHook(useSearchSetup, { wrapper })
    await waitFor(() => expect(result.current.offer).toBeDefined())

    expect(getMatchesMock).toHaveBeenCalledTimes(1)
  })
})
