import { renderHook, waitFor } from '@testing-library/react-native'
import { NavigationWrapper } from '../../../../tests/unit/helpers/NavigationWrapper'
import { QueryClientWrapper } from '../../../../tests/unit/helpers/QueryClientWrapper'
import { useSearchSetup } from './useSearchSetup'
import { buyOffer } from '../../../../tests/unit/data/offerData'

const useRouteMock = jest.fn(() => ({
  params: {
    offerId: '11',
  },
}))

jest.mock('../../../hooks/useRoute', () => ({
  useRoute: () => useRouteMock(),
}))

const getMatchesMock = jest.fn().mockResolvedValue([[], null])
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
  it('should load offer', async () => {
    const { result } = renderHook(useSearchSetup, { wrapper })
    await waitFor(() => expect(result.current.offer).toBeDefined())
    expect(result.current).toEqual({ offer: buyOffer, hasMatches: false })
  })

  it('should call get matches once', async () => {
    const { result } = renderHook(useSearchSetup, { wrapper })
    await waitFor(() => expect(result.current.offer).toBeDefined())

    expect(getMatchesMock).toHaveBeenCalledTimes(1)
  })
})
