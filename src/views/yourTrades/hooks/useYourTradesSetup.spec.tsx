import { renderHook } from '@testing-library/react-native'
import { NavigationWrapper } from '../../../../tests/unit/helpers/NavigationWrapper'
import { QueryClientWrapper } from '../../../../tests/unit/helpers/QueryClientWrapper'
import { useYourTradesSetup } from './useYourTradesSetup'

const useRouteMock = jest.fn(() => ({
  params: {},
}))

jest.mock('../../../hooks/useRoute', () => ({
  useRoute: () => useRouteMock(),
}))

const getContractSummariesMock = jest.fn().mockResolvedValue([[], null])
const getOfferSummariesMock = jest.fn().mockResolvedValue([[], null])
jest.mock('../../../utils/peachAPI', () => ({
  getContractSummaries: (...args: any[]) => getContractSummariesMock(...args),
  getOfferSummaries: (...args: any[]) => getOfferSummariesMock(...args),
}))

const wrapper = ({ children }: ComponentProps) => (
  <NavigationWrapper>
    <QueryClientWrapper>{children}</QueryClientWrapper>
  </NavigationWrapper>
)

jest.useFakeTimers()

describe('useYourTradesSetup', () => {
  const tabs = [
    { display: 'buy', id: 'buy' },
    { display: 'sell', id: 'sell' },
    { display: 'history', id: 'history' },
  ]

  it('should return defaults', () => {
    const { result } = renderHook(useYourTradesSetup, { wrapper })
    expect(result.current).toEqual({
      isLoading: true,
      refetch: expect.any(Function),
      allOpenOffers: [],
      openOffers: { buy: [], sell: [] },
      pastOffers: [],
      tabs,
      currentTab: {
        display: 'buy',
        id: 'buy',
      },
      setCurrentTab: expect.any(Function),
    })
  })

  it('should call offer and contract summaries once', () => {
    renderHook(useYourTradesSetup, { wrapper })
    expect(getOfferSummariesMock).toHaveBeenCalledTimes(1)
    expect(getContractSummariesMock).toHaveBeenCalledTimes(1)
  })
})
