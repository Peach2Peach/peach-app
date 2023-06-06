import { renderHook } from '@testing-library/react-native'
import { headerState, NavigationWrapper } from '../../../../tests/unit/helpers/NavigationWrapper'
import { useContractHeaderSetup } from './useContractHeaderSetup'

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
      { wrapper: NavigationWrapper },
    )
    expect(headerState.header()).toMatchSnapshot()
  })
  it('should show the cancel icon if the contract can be cancelled', () => {
    renderHook(
      () =>
        useContractHeaderSetup({
          contract: { disputeActive: false },
          view: 'buyer',
          requiredAction: 'none',
          contractId: '123',
        }),
      { wrapper: NavigationWrapper },
    )

    expect(useHeaderState.getState().titleComponent).toMatchSnapshot()
    expect(useHeaderState.getState().icons).toEqual([
      {
        color: '#9F8C82',
        id: 'xCircle',
        onPress: expect.any(Function),
      },
    ])
    expect(useHeaderState.getState().hideGoBackButton).toEqual(false)
  })
  it('should show the make payment help icon if the contract is in the buyer view and requires a payment', () => {
    renderHook(
      () =>
        useContractHeaderSetup({
          contract: { disputeActive: false },
          view: 'buyer',
          requiredAction: 'sendPayment',
          contractId: '123',
        }),
      { wrapper: NavigationWrapper },
    )

    expect(useHeaderState.getState().titleComponent).toMatchSnapshot()
    expect(useHeaderState.getState().icons).toEqual([
      {
        color: '#9F8C82',
        id: 'xCircle',
        onPress: expect.any(Function),
      },
      {
        color: '#099DE2',
        id: 'helpCircle',
        onPress: expect.any(Function),
      },
    ])
    expect(useHeaderState.getState().hideGoBackButton).toEqual(false)
  })
  it('should show the confirm payment help icon if the contract is in the seller view and requires a payment', () => {
    renderHook(
      () =>
        useContractHeaderSetup({
          contract: { disputeActive: false },
          view: 'seller',
          requiredAction: 'confirmPayment',
          contractId: '123',
        }),
      { wrapper: NavigationWrapper },
    )

    expect(useHeaderState.getState().titleComponent).toMatchSnapshot()
    expect(useHeaderState.getState().icons).toEqual([
      {
        color: '#099DE2',
        id: 'helpCircle',
        onPress: expect.any(Function),
      },
    ])
    expect(useHeaderState.getState().hideGoBackButton).toEqual(false)
  })
})
