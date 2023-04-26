import { renderHook } from '@testing-library/react-native'
import { useTradeCanceledOverlay } from './useTradeCanceledOverlay'
import { contract } from '../../../tests/unit/data/contractData'
import { sellOffer } from '../../../tests/unit/data/offerData'
import i18n from '../../utils/i18n'
import { OfferRepublished } from './OfferRepublished'
import { ContractCanceledToSeller } from './ContractCanceledToSeller'
import { BuyerConfirmedCancelTrade } from './BuyerConfirmedCancelTrade'

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

const startRefundOverlayMock = jest.fn()
jest.mock('../useStartRefundOverlay', () => ({
  useStartRefundOverlay: () => startRefundOverlayMock,
}))

const saveContractMock = jest.fn()
jest.mock('../../utils/contract/saveContract', () => ({
  saveContract: (...args: any[]) => saveContractMock(...args),
}))

const getSellOfferFromContractMock = jest.fn().mockReturnValue(sellOffer)
jest.mock('../../utils/contract/getSellOfferFromContract', () => ({
  getSellOfferFromContract: (...args: any[]) => getSellOfferFromContractMock(...args),
}))

const reviveSuccess = {
  newOfferId: '2',
}
const reviveSellOfferMock = jest.fn().mockResolvedValue([reviveSuccess, null])
jest.mock('../../utils/peachAPI', () => ({
  reviveSellOffer: (...args: any[]) => reviveSellOfferMock(...args),
}))

const showErrorBannerMock = jest.fn()
const useShowErrorBannerMock = jest.fn().mockReturnValue(showErrorBannerMock)
jest.mock('../../hooks/useShowErrorBanner', () => ({
  useShowErrorBanner: () => useShowErrorBannerMock(),
}))

describe('useTradeCanceledOverlay', () => {
  const now = new Date()
  afterEach(() => {
    jest.clearAllMocks()
  })
  it('should return the correct default values', () => {
    const { result } = renderHook(useTradeCanceledOverlay)
    expect(result.current).toStrictEqual({
      showTradeCanceled: expect.any(Function),
      republishOffer: expect.any(Function),
      confirmOverlay: expect.any(Function),
    })
  })
  it('confirms trade cancelation', () => {
    const { result } = renderHook(useTradeCanceledOverlay)
    result.current.confirmOverlay(contract)
    expect(saveContractMock).toHaveBeenCalledWith({
      ...contract,
      cancelConfirmationDismissed: true,
      cancelConfirmationPending: false,
    })
    expect(updateOverlayMock).toHaveBeenCalledWith({ visible: false })
  })
  it('republishes sell offer', async () => {
    const { result } = renderHook(useTradeCanceledOverlay)
    const { closeAction, goToOfferAction } = await result.current.republishOffer(sellOffer, contract)
    expect(reviveSellOfferMock).toHaveBeenCalledWith({ offerId: sellOffer.id })
    expect(updateOverlayMock).toHaveBeenCalledWith({
      title: i18n('contract.cancel.offerRepublished.title'),
      content: <OfferRepublished />,
      visible: true,
      level: 'APP',
      requireUserAction: true,
      action1: {
        label: i18n('goToOffer'),
        icon: 'arrowRightCircle',
        callback: goToOfferAction,
      },
      action2: {
        label: i18n('close'),
        icon: 'xSquare',
        callback: closeAction,
      },
    })
  })
  it('goes to offer after republishing', async () => {
    const { result } = renderHook(useTradeCanceledOverlay)
    const { goToOfferAction } = await result.current.republishOffer(sellOffer, contract)
    goToOfferAction()
    expect(replaceMock).toHaveBeenCalledWith('search', { offerId: reviveSuccess.newOfferId })
    expect(updateOverlayMock).toHaveBeenCalledWith({ visible: false })
  })
  it('does not go to offer if republishing failed', async () => {
    reviveSellOfferMock.mockResolvedValueOnce([null, apiError])
    const { result } = renderHook(useTradeCanceledOverlay)
    const { goToOfferAction } = await result.current.republishOffer(sellOffer, contract)
    goToOfferAction()
    expect(replaceMock).not.toHaveBeenCalled()
  })
  it('reloads contract screen after republishing', async () => {
    const { result } = renderHook(useTradeCanceledOverlay)
    const { closeAction } = await result.current.republishOffer(sellOffer, contract)
    closeAction()
    expect(replaceMock).toHaveBeenCalledWith('contract', { contractId: contract.id })
    expect(updateOverlayMock).toHaveBeenCalledWith({ visible: false })
  })
  it('handles republishing errors', async () => {
    reviveSellOfferMock.mockResolvedValueOnce([null, apiError])
    const { result } = renderHook(useTradeCanceledOverlay)
    await result.current.republishOffer(sellOffer, contract)
    expect(updateOverlayMock).toHaveBeenCalledWith({ visible: false })
    expect(showErrorBannerMock).toHaveBeenCalledWith(apiError.error)
  })
  it('shows navigates to trade overview history tab when showing trade canceled overlay', () => {
    getSellOfferFromContractMock.mockReturnValueOnce(sellOffer)
    const { result } = renderHook(useTradeCanceledOverlay)
    result.current.showTradeCanceled(contract, false)
    expect(navigateMock).toHaveBeenCalledWith('yourTrades', { tab: 'history' })
  })
  it('shows trade canceled overlay for non mutual cancel and non expired sell offer', () => {
    const nonExpiredSellOffer = { ...sellOffer, publishingDate: now }
    getSellOfferFromContractMock.mockReturnValueOnce(nonExpiredSellOffer)
    const { result } = renderHook(useTradeCanceledOverlay)
    const { republishAction, refundAction } = result.current.showTradeCanceled(contract, false)
    expect(updateOverlayMock).toHaveBeenCalledWith({
      title: i18n('contract.cancel.buyer.canceled.title'),
      content: <ContractCanceledToSeller contract={contract} />,
      visible: true,
      level: 'WARN',
      requireUserAction: true,
      action1: {
        label: i18n('contract.cancel.tradeCanceled.republish'),
        icon: 'refreshCw',
        callback: republishAction,
      },
      action2: {
        label: i18n('contract.cancel.tradeCanceled.refund'),
        icon: 'download',
        callback: refundAction,
      },
    })
  })
  it('shows trade canceled overlay for non mutual cancel and expired sell offer', () => {
    const expiredSellOffer = { ...sellOffer, publishingDate: new Date(2022, 1, 1) }
    getSellOfferFromContractMock.mockReturnValueOnce(expiredSellOffer)
    const { result } = renderHook(useTradeCanceledOverlay)
    const { refundAction } = result.current.showTradeCanceled(contract, false)
    expect(updateOverlayMock).toHaveBeenCalledWith({
      title: i18n('contract.cancel.buyer.canceled.title'),
      content: <ContractCanceledToSeller contract={contract} />,
      visible: true,
      level: 'WARN',
      requireUserAction: true,
      action1: {
        label: i18n('contract.cancel.tradeCanceled.refund'),
        icon: 'download',
        callback: refundAction,
      },
    })
  })
  it('shows trade canceled overlay for mutual cancel and non expired sell offer', () => {
    const nonExpiredSellOffer = { ...sellOffer, publishingDate: now }
    getSellOfferFromContractMock.mockReturnValueOnce(nonExpiredSellOffer)
    const { result } = renderHook(useTradeCanceledOverlay)
    const { republishAction, refundAction } = result.current.showTradeCanceled(contract, true)
    expect(updateOverlayMock).toHaveBeenCalledWith({
      title: i18n('contract.cancel.buyerConfirmed.title'),
      content: <BuyerConfirmedCancelTrade contract={contract} />,
      visible: true,
      level: 'WARN',
      requireUserAction: true,
      action1: {
        label: i18n('contract.cancel.tradeCanceled.republish'),
        icon: 'refreshCw',
        callback: republishAction,
      },
      action2: {
        label: i18n('contract.cancel.tradeCanceled.refund'),
        icon: 'download',
        callback: refundAction,
      },
    })
  })
  it('shows trade canceled overlay for mutual cancel and expired sell offer', () => {
    const expiredSellOffer = { ...sellOffer, publishingDate: new Date(2022, 1, 1) }
    getSellOfferFromContractMock.mockReturnValueOnce(expiredSellOffer)
    const { result } = renderHook(useTradeCanceledOverlay)
    const { refundAction } = result.current.showTradeCanceled(contract, true)
    expect(updateOverlayMock).toHaveBeenCalledWith({
      title: i18n('contract.cancel.buyerConfirmed.title'),
      content: <BuyerConfirmedCancelTrade contract={contract} />,
      visible: true,
      level: 'WARN',
      requireUserAction: true,
      action1: {
        label: i18n('contract.cancel.tradeCanceled.refund'),
        icon: 'download',
        callback: refundAction,
      },
    })
  })
  it('triggers republish action from overlay', () => {
    getSellOfferFromContractMock.mockReturnValueOnce(sellOffer)
    const { result } = renderHook(useTradeCanceledOverlay)
    const { republishAction } = result.current.showTradeCanceled(contract, true)
    republishAction()
    expect(reviveSellOfferMock).toHaveBeenCalledWith({ offerId: sellOffer.id })
  })
  it('triggers refund action from overlay', () => {
    getSellOfferFromContractMock.mockReturnValueOnce(sellOffer)
    const { result } = renderHook(useTradeCanceledOverlay)
    const { refundAction } = result.current.showTradeCanceled(contract, true)
    refundAction()
    expect(startRefundOverlayMock).toHaveBeenCalledWith(sellOffer)
    expect(saveContractMock).toHaveBeenCalled()
  })
  it('does not show trade cancel overlay if sell offer cannot be found', () => {
    getSellOfferFromContractMock.mockReturnValueOnce(null)
    const { result } = renderHook(useTradeCanceledOverlay)
    result.current.showTradeCanceled(contract, true)
    expect(updateOverlayMock).not.toHaveBeenCalled()
  })
  it('does not show trade cancel overlay if sell offer has already been refunded', () => {
    getSellOfferFromContractMock.mockReturnValueOnce({ ...sellOffer, refunded: true })
    const { result } = renderHook(useTradeCanceledOverlay)
    result.current.showTradeCanceled(contract, true)
    expect(updateOverlayMock).not.toHaveBeenCalled()
  })
  it('does not show trade cancel overlay if escrow has already been released', () => {
    getSellOfferFromContractMock.mockReturnValueOnce({ ...sellOffer, released: true })
    const { result } = renderHook(useTradeCanceledOverlay)
    result.current.showTradeCanceled(contract, true)
    expect(updateOverlayMock).not.toHaveBeenCalled()
  })
  it('does not show trade cancel overlay if sell offer has already been re-published', () => {
    getSellOfferFromContractMock.mockReturnValueOnce({ ...sellOffer, newOfferId: '4' })
    const { result } = renderHook(useTradeCanceledOverlay)
    result.current.showTradeCanceled(contract, true)
    expect(updateOverlayMock).not.toHaveBeenCalled()
  })
})
