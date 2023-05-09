import { renderHook, waitFor } from '@testing-library/react-native'
import { buyOffer } from '../../../../tests/unit/data/offerData'
import { NavigationWrapper } from '../../../../tests/unit/helpers/NavigationWrapper'
import { QueryClientWrapper } from '../../../../tests/unit/helpers/QueryClientWrapper'
import { useSearchSetup } from './useSearchSetup'

jest.mock('../../../hooks/useRoute', () => ({
  useRoute: () => ({
    params: {
      offerId: '11',
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
  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should return defaults', () => {
    const { result } = renderHook(useSearchSetup, { wrapper })
    expect(result.current).toEqual({ offer: undefined, hasMatches: false })
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
