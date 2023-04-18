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
          contract: {
            id: '1',
            status: 'tradeInDispute',
            buyer: {
              id: '1',
              name: 'John',
              avatar: 'https://example.com/avatar.png',
            },
            seller: {
              id: '2',
              name: 'Jane',
              avatar: 'https://example.com/avatar.png',
            },
            items: [
              {
                id: '1',
                name: 'Item 1',
                price: 100,
                quantity: 1,
                image: 'https://example.com/image.png',
              },
            ],
            payment: {
              id: '1',
              status: 'pending',
              amount: 100,
              currency: 'USD',
              method: 'bankTransfer',
              createdAt: '2021-01-01T00:00:00Z',
            },
            createdAt: '2021-01-01T00:00:00Z',
          },
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
