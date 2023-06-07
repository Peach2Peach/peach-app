import { renderHook } from '@testing-library/react-native'
import { headerState, NavigationWrapper } from '../../../tests/unit/helpers/NavigationWrapper'
import { QueryClientWrapper } from '../../../tests/unit/helpers/QueryClientWrapper'
import { useOfferDetailsSetup } from './useOfferDetailsSetup'

const offerId = '123'
const useRouteMock = jest.fn(() => ({
  params: {
    offerId,
  },
}))
jest.mock('../../hooks/useRoute', () => ({
  useRoute: () => useRouteMock(),
}))

const wrapper = ({ children }: ComponentProps) => (
  <NavigationWrapper>
    <QueryClientWrapper>{children}</QueryClientWrapper>
  </NavigationWrapper>
)

jest.useFakeTimers()

describe('useOfferDetailsSetup', () => {
  it('should set up header correctly', () => {
    renderHook(useOfferDetailsSetup, { wrapper })
    expect(headerState.header()).toMatchSnapshot()
  })
})
