import { renderHook } from '@testing-library/react-native'
import { NavigationWrapper } from '../../../tests/unit/helpers/NavigationWrapper'
import { QueryClientWrapper } from '../../../tests/unit/helpers/QueryClientWrapper'
import { useHeaderState } from '../../components/header/store'
import { useOfferDetailsSetup } from './useOfferDetailsSetup'
import { OfferDetailsTitle } from './components/OfferDetailsTitle'

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
    expect(useHeaderState.getState().titleComponent?.type).toEqual(OfferDetailsTitle)
    expect(useHeaderState.getState().titleComponent?.props).toEqual({ id: offerId })
  })
})
