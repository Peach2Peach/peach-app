import { renderHook } from '@testing-library/react-native'
import { NavigationWrapper } from '../../../../tests/unit/helpers/NavigationWrapper'
import { useHeaderState } from '../../../components/header/store'
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
    expect(useHeaderState.getState().title).toBe('custom payout wallet')
    expect(useHeaderState.getState().icons?.[0].id).toBe('helpCircle')
  })
})
