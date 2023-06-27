import { renderHook } from '@testing-library/react-native'
import { NavigationAndQueryClientWrapper } from '../../../tests/unit/helpers/NavigationAndQueryClientWrapper'
import { headerState } from '../../../tests/unit/helpers/NavigationWrapper'
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

const wrapper = NavigationAndQueryClientWrapper

jest.useFakeTimers()

describe('useOfferDetailsSetup', () => {
  it('should set up header correctly', () => {
    renderHook(useOfferDetailsSetup, { wrapper })
    expect(headerState.header()).toMatchSnapshot()
  })
})
