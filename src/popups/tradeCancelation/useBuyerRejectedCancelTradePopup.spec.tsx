import { renderHook } from '@testing-library/react-native'
import { act } from 'react-test-renderer'
import { contract } from '../../../tests/unit/data/contractData'
import { NavigationWrapper, replaceMock } from '../../../tests/unit/helpers/NavigationWrapper'
import { defaultPopupState, usePopupStore } from '../../store/usePopupStore'
import { getContract } from '../../utils/contract'
import i18n from '../../utils/i18n'
import { BuyerRejectedCancelTrade } from './BuyerRejectedCancelTrade'
import { useBuyerRejectedCancelTradePopup } from './useBuyerRejectedCancelTradePopup'

describe('useBuyerRejectedCancelTradePopup', () => {
  const { result } = renderHook(useBuyerRejectedCancelTradePopup, { wrapper: NavigationWrapper })
  afterEach(() => {
    usePopupStore.setState(defaultPopupState)
  })
  it('should show the popup', () => {
    const showCancelTradeRequestRejected = result.current
    act(() => showCancelTradeRequestRejected(contract))
    expect(usePopupStore.getState()).toEqual({
      ...usePopupStore.getState(),
      title: i18n('contract.cancel.buyerRejected.title'),
      content: <BuyerRejectedCancelTrade contract={contract} />,
      visible: true,
      requireUserAction: true,
      level: 'WARN',
      action1: {
        label: i18n('close'),
        icon: 'xSquare',
        callback: expect.any(Function),
      },
    })
  })
  it('should hide the popup, navigate to contract screen and save contract when action is called', () => {
    const showCancelTradeRequestRejected = result.current
    act(() => {
      showCancelTradeRequestRejected(contract)
      usePopupStore.getState().action1?.callback()
    })
    expect(usePopupStore.getState().visible).toEqual(false)
    expect(replaceMock).toHaveBeenCalledWith('contract', { contractId: contract.id })
    expect(getContract(contract.id)).toStrictEqual({
      ...contract,
      cancelConfirmationDismissed: true,
      cancelConfirmationPending: false,
    })
  })
})
