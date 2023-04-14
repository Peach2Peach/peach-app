import { renderHook } from '@testing-library/react-native'
import { account1 } from '../../../tests/unit/data/accountData'
import { contract } from '../../../tests/unit/data/contractData'
import { sellOffer } from '../../../tests/unit/data/offerData'
import { Loading } from '../../components'
import tw from '../../styles/tailwind'
import { setAccount } from '../../utils/account'
import i18n from '../../utils/i18n'
import { getResult } from '../../utils/result'
import { ConfirmCancelTrade } from './ConfirmCancelTrade'
import { useBuyerRejectedCancelTradeOverlay } from './useBuyerRejectedCancelTradeOverlay'
import { BuyerRejectedCancelTrade } from './BuyerRejectedCancelTrade'

const apiError = { error: 'UNAUTHORIZED' }
const navigateMock = jest.fn()
const replaceMock = jest.fn()
jest.mock('../../hooks/useNavigation', () => ({
  useNavigation: () => ({
    navigate: navigateMock,
    replace: replaceMock,
  }),
}))

const updateOverlayMock = jest.fn()
const useOverlayContextMock = jest.fn().mockReturnValue([, updateOverlayMock])
jest.mock('../../contexts/overlay', () => ({
  useOverlayContext: () => useOverlayContextMock(),
}))

const saveContractMock = jest.fn()
jest.mock('../../utils/contract/saveContract', () => ({
  saveContract: (...args: any[]) => saveContractMock(...args),
}))
describe('useBuyerRejectedCancelTradeOverlay', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })
  it('should return the correct default values', () => {
    const { result } = renderHook(useBuyerRejectedCancelTradeOverlay)
    expect(result.current).toStrictEqual({
      showCancelTradeRequestRejected: expect.any(Function),
      confirmOverlay: expect.any(Function),
    })
  })
  it('update contract when confirming', () => {
    const { result } = renderHook(useBuyerRejectedCancelTradeOverlay)
    result.current.confirmOverlay(contract)
    expect(saveContractMock).toHaveBeenCalledWith({
      ...contract,
      cancelConfirmationDismissed: true,
      cancelConfirmationPending: false,
    })
  })
  it('close overlay and navigate to contract when confirming', () => {
    const { result } = renderHook(useBuyerRejectedCancelTradeOverlay)
    result.current.confirmOverlay(contract)
    expect(updateOverlayMock).toHaveBeenCalledWith({ visible: false })
    expect(replaceMock).toHaveBeenCalledWith('contract', { contractId: contract.id })
  })
  it('should show showCancelTradeRequestRejected overlay', () => {
    const { result } = renderHook(useBuyerRejectedCancelTradeOverlay)
    const { closeAction } = result.current.showCancelTradeRequestRejected(contract)
    expect(updateOverlayMock).toHaveBeenCalledWith({
      title: i18n('contract.cancel.buyerRejected.title'),
      content: <BuyerRejectedCancelTrade contract={contract} />,
      visible: true,
      requireUserAction: true,
      level: 'WARN',
      action1: {
        label: i18n('close'),
        icon: 'xSquare',
        callback: closeAction,
      },
    })
  })
  it('trigger confirm action', () => {
    const { result } = renderHook(useBuyerRejectedCancelTradeOverlay)
    const { closeAction } = result.current.showCancelTradeRequestRejected(contract)
    closeAction()
    expect(saveContractMock).toHaveBeenCalled()
  })
})
