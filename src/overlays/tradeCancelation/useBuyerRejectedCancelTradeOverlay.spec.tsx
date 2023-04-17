import { renderHook } from '@testing-library/react-native'
import { contract } from '../../../tests/unit/data/contractData'
import i18n from '../../utils/i18n'
import { useBuyerRejectedCancelTradeOverlay } from './useBuyerRejectedCancelTradeOverlay'
import { BuyerRejectedCancelTrade } from './BuyerRejectedCancelTrade'
import { act } from 'react-test-renderer'
import { defaultOverlay, OverlayContext } from '../../contexts/overlay'
import { getContract } from '../../utils/contract'

const replaceMock = jest.fn()
jest.mock('../../hooks/useNavigation', () => ({
  useNavigation: () => ({
    replace: replaceMock,
  }),
}))

describe('useBuyerRejectedCancelTradeOverlay', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })
  let overlayState = { ...defaultOverlay }
  const updateOverlay = jest.fn((newState) => (overlayState = newState))

  const { result } = renderHook(useBuyerRejectedCancelTradeOverlay, {
    wrapper: ({ children }) => (
      <OverlayContext.Provider value={[overlayState, updateOverlay]}>{children}</OverlayContext.Provider>
    ),
  })
  afterEach(() => {
    jest.clearAllMocks()
    overlayState = { ...defaultOverlay }
  })
  it('should show the overlay', () => {
    const showCancelTradeRequestRejected = result.current
    act(() => showCancelTradeRequestRejected(contract))
    expect(overlayState).toStrictEqual({
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
  it('should hide the overlay, navigate to contract screen and save contract when action is called', () => {
    const showCancelTradeRequestRejected = result.current
    act(() => {
      showCancelTradeRequestRejected(contract)
      overlayState.action1?.callback()
    })
    expect(overlayState).toStrictEqual({
      visible: false,
    })
    expect(replaceMock).toHaveBeenCalledWith('contract', { contractId: contract.id })
    expect(getContract(contract.id)).toStrictEqual({
      ...contract,
      cancelConfirmationDismissed: true,
      cancelConfirmationPending: false,
    })
  })
})
