import { renderHook } from '@testing-library/react-native'
import { headerState, NavigationWrapper } from '../../../../tests/unit/helpers/NavigationWrapper'
import { usePayoutAddressSetup } from './usePayoutAddressSetup'

const useRouteMock = jest.fn(() => ({
  params: {},
}))
jest.mock('../../../hooks/useRoute', () => ({
  useRoute: () => useRouteMock(),
}))

describe('usePayoutAddressSetup', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should set up header correctly', () => {
    renderHook(usePayoutAddressSetup, { wrapper: NavigationWrapper })
    expect(headerState.header()).toMatchSnapshot()
  })
})
