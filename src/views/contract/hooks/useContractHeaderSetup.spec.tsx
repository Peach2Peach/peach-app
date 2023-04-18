import { useContractHeaderSetup } from './useContractHeaderSetup'
import { renderHook } from '@testing-library/react-native'
import { useHeaderState } from '../../../components/header/store'
import { DisputeContractTitle } from '../../../components/titles/DisputeContractTitle'
import { NavigationContext } from '@react-navigation/native'

const navContext = {
  isFocused: () => true,
  addListener: jest.fn(() => jest.fn()),
}

const navigationWrapper = ({ children }) => (
  <NavigationContext.Provider value={navContext}>{children}</NavigationContext.Provider>
)

describe('useContractHeaderSetup', () => {
  it('should set up the header correctly for trade in dispute', () => {
    renderHook(
      () =>
        useContractHeaderSetup({
          contract: { disputeActive: true },
          view: 'buyer',
          requiredAction: 'none',
          contractId: '123',
        }),
      { wrapper: navigationWrapper },
    )

    expect(useHeaderState.getState().titleComponent).toEqual(<DisputeContractTitle id="123" />)
    expect(useHeaderState.getState().icons).toEqual([])
    expect(useHeaderState.getState().hideGoBackButton).toEqual(false)
  })
})
