import { renderHook } from '@testing-library/react-native'
import { contract } from '../../../tests/unit/data/contractData'
import { sellOffer } from '../../../tests/unit/data/offerData'
import { unauthorizedError } from '../../../tests/unit/data/peachAPIData'
import { defaultPopupState, usePopupStore } from '../../store/usePopupStore'
import { BuyerConfirmedCancelTrade } from './BuyerConfirmedCancelTrade'
import { ContractCanceledToSeller } from './ContractCanceledToSeller'
import { OfferRepublished } from './OfferRepublished'
import { useTradeCanceledPopup } from './useTradeCanceledPopup'

const navigateMock = jest.fn()
const replaceMock = jest.fn()
jest.mock('../../hooks/useNavigation', () => ({
  useNavigation: () => ({
    navigate: navigateMock,
    replace: replaceMock,
  }),
}))

const startRefundPopupMock = jest.fn()
jest.mock('../useStartRefundPopup', () => ({
  useStartRefundPopup: () => startRefundPopupMock,
}))

const saveContractMock = jest.fn()
jest.mock('../../utils/contract/saveContract', () => ({
  saveContract: (...args: unknown[]) => saveContractMock(...args),
}))

const getSellOfferFromContractMock = jest.fn().mockReturnValue(sellOffer)
jest.mock('../../utils/contract/getSellOfferFromContract', () => ({
  getSellOfferFromContract: (...args: unknown[]) => getSellOfferFromContractMock(...args),
}))

const reviveSuccess = {
  newOfferId: '2',
}
const reviveSellOfferMock = jest.fn().mockResolvedValue([reviveSuccess, null])
jest.mock('../../utils/peachAPI', () => ({
  reviveSellOffer: (...args: unknown[]) => reviveSellOfferMock(...args),
}))

const showErrorBannerMock = jest.fn()
const useShowErrorBannerMock = jest.fn().mockReturnValue(showErrorBannerMock)
jest.mock('../../hooks/useShowErrorBanner', () => ({
  useShowErrorBanner: () => useShowErrorBannerMock(),
}))

describe('useTradeCanceledPopup', () => {
  const now = new Date()

  afterEach(() => {
    usePopupStore.setState(defaultPopupState)
  })
  it('should return the correct default values', () => {
    const { result } = renderHook(useTradeCanceledPopup)
    expect(result.current).toStrictEqual({
      showTradeCanceled: expect.any(Function),
      republishOffer: expect.any(Function),
      confirmPopup: expect.any(Function),
    })
  })
  it('confirms trade cancelation', () => {
    const { result } = renderHook(useTradeCanceledPopup)
    result.current.confirmPopup(contract)
    expect(saveContractMock).toHaveBeenCalledWith({
      ...contract,
      cancelConfirmationDismissed: true,
      cancelConfirmationPending: false,
    })
    expect(usePopupStore.getState().visible).toEqual(false)
  })
  it('republishes sell offer', async () => {
    const { result } = renderHook(useTradeCanceledPopup)
    await result.current.republishOffer(sellOffer, contract)
    expect(reviveSellOfferMock).toHaveBeenCalledWith({ offerId: sellOffer.id })
    expect(usePopupStore.getState()).toEqual({
      ...usePopupStore.getState(),
      title: 'offer re-published',
      content: <OfferRepublished />,
      visible: true,
      level: 'APP',
      requireUserAction: true,
      action1: {
        label: 'go to offer',
        icon: 'arrowRightCircle',
        callback: expect.any(Function),
      },
      action2: {
        label: 'close',
        icon: 'xSquare',
        callback: expect.any(Function),
      },
    })
  })
  it('goes to offer after republishing', async () => {
    const { result } = renderHook(useTradeCanceledPopup)
    await result.current.republishOffer(sellOffer, contract)
    usePopupStore.getState().action1?.callback()
    expect(replaceMock).toHaveBeenCalledWith('search', { offerId: reviveSuccess.newOfferId })
    expect(usePopupStore.getState().visible).toEqual(false)
  })
  it('does not go to offer if republishing failed', async () => {
    reviveSellOfferMock.mockResolvedValueOnce([null, unauthorizedError])
    const { result } = renderHook(useTradeCanceledPopup)
    await result.current.republishOffer(sellOffer, contract)
    usePopupStore.getState().action1?.callback()
    expect(replaceMock).not.toHaveBeenCalled()
  })
  it('reloads contract screen after republishing', async () => {
    const { result } = renderHook(useTradeCanceledPopup)
    await result.current.republishOffer(sellOffer, contract)
    usePopupStore.getState().action2?.callback()
    expect(replaceMock).toHaveBeenCalledWith('contract', { contractId: contract.id })
    expect(usePopupStore.getState().visible).toEqual(false)
  })
  it('handles republishing errors', async () => {
    reviveSellOfferMock.mockResolvedValueOnce([null, unauthorizedError])
    const { result } = renderHook(useTradeCanceledPopup)
    await result.current.republishOffer(sellOffer, contract)
    expect(usePopupStore.getState().visible).toEqual(false)
    expect(showErrorBannerMock).toHaveBeenCalledWith(unauthorizedError.error)
  })
  it('shows navigates to trade overview history tab when showing trade canceled popup', () => {
    getSellOfferFromContractMock.mockReturnValueOnce(sellOffer)
    const { result } = renderHook(useTradeCanceledPopup)
    result.current.showTradeCanceled(contract, false)
    expect(navigateMock).toHaveBeenCalledWith('yourTrades', { tab: 'history' })
  })
  it('shows trade canceled popup for non mutual cancel and non expired sell offer', () => {
    const nonExpiredSellOffer = { ...sellOffer, publishingDate: now }
    getSellOfferFromContractMock.mockReturnValueOnce(nonExpiredSellOffer)
    const { result } = renderHook(useTradeCanceledPopup)
    const { republishAction, refundAction } = result.current.showTradeCanceled(contract, false)
    expect(usePopupStore.getState()).toEqual({
      ...usePopupStore.getState(),
      title: 'your buyer canceled',
      content: <ContractCanceledToSeller contract={contract} />,
      visible: true,
      level: 'DEFAULT',
      requireUserAction: true,
      action1: {
        label: 're-publish offer',
        icon: 'refreshCw',
        callback: republishAction,
      },
      action2: {
        label: 'refund me',
        icon: 'download',
        callback: refundAction,
      },
    })
  })
  it('shows trade canceled popup for non mutual cancel and expired sell offer', () => {
    const expiredSellOffer = { ...sellOffer, publishingDate: new Date(2022, 1, 1) }
    getSellOfferFromContractMock.mockReturnValueOnce(expiredSellOffer)
    const { result } = renderHook(useTradeCanceledPopup)
    const { refundAction } = result.current.showTradeCanceled(contract, false)
    expect(usePopupStore.getState()).toEqual({
      ...usePopupStore.getState(),
      title: 'your buyer canceled',
      content: <ContractCanceledToSeller contract={contract} />,
      visible: true,
      level: 'DEFAULT',
      requireUserAction: true,
      action1: {
        label: 'refund me',
        icon: 'download',
        callback: refundAction,
      },
    })
  })
  it('shows trade canceled popup for mutual cancel and non expired sell offer', () => {
    const nonExpiredSellOffer = { ...sellOffer, publishingDate: now }
    getSellOfferFromContractMock.mockReturnValueOnce(nonExpiredSellOffer)
    const { result } = renderHook(useTradeCanceledPopup)
    const { republishAction, refundAction } = result.current.showTradeCanceled(contract, true)
    expect(usePopupStore.getState()).toEqual({
      ...usePopupStore.getState(),
      title: 'trade canceled',
      content: <BuyerConfirmedCancelTrade contract={contract} />,
      visible: true,
      level: 'DEFAULT',
      requireUserAction: true,
      action1: {
        label: 're-publish offer',
        icon: 'refreshCw',
        callback: republishAction,
      },
      action2: {
        label: 'refund me',
        icon: 'download',
        callback: refundAction,
      },
    })
  })
  it('shows trade canceled popup for mutual cancel and expired sell offer', () => {
    const expiredSellOffer = { ...sellOffer, publishingDate: new Date(2022, 1, 1) }
    getSellOfferFromContractMock.mockReturnValueOnce(expiredSellOffer)
    const { result } = renderHook(useTradeCanceledPopup)
    const { refundAction } = result.current.showTradeCanceled(contract, true)
    expect(usePopupStore.getState()).toEqual({
      ...usePopupStore.getState(),
      title: 'trade canceled',
      content: <BuyerConfirmedCancelTrade contract={contract} />,
      visible: true,
      level: 'DEFAULT',
      requireUserAction: true,
      action1: {
        label: 'refund me',
        icon: 'download',
        callback: refundAction,
      },
    })
  })
  it('triggers republish action from popup', () => {
    getSellOfferFromContractMock.mockReturnValueOnce(sellOffer)
    const { result } = renderHook(useTradeCanceledPopup)
    const { republishAction } = result.current.showTradeCanceled(contract, true)
    republishAction()
    expect(reviveSellOfferMock).toHaveBeenCalledWith({ offerId: sellOffer.id })
  })
  it('triggers refund action from popup', () => {
    getSellOfferFromContractMock.mockReturnValueOnce(sellOffer)
    const { result } = renderHook(useTradeCanceledPopup)
    const { refundAction } = result.current.showTradeCanceled(contract, true)
    refundAction()
    expect(startRefundPopupMock).toHaveBeenCalledWith(sellOffer)
    expect(saveContractMock).toHaveBeenCalled()
  })
  it('does not show trade cancel popup if sell offer cannot be found', () => {
    getSellOfferFromContractMock.mockReturnValueOnce(null)
    const { result } = renderHook(useTradeCanceledPopup)
    result.current.showTradeCanceled(contract, true)
    expect(usePopupStore.getState()).toEqual({
      ...usePopupStore.getState(),
      ...defaultPopupState,
    })
  })
  it('does not show trade cancel popup if sell offer has already been refunded', () => {
    getSellOfferFromContractMock.mockReturnValueOnce({ ...sellOffer, refunded: true })
    const { result } = renderHook(useTradeCanceledPopup)
    result.current.showTradeCanceled(contract, true)
    expect(usePopupStore.getState()).toEqual({
      ...usePopupStore.getState(),
      ...defaultPopupState,
    })
  })
  it('does not show trade cancel popup if escrow has already been released', () => {
    getSellOfferFromContractMock.mockReturnValueOnce({ ...sellOffer, released: true })
    const { result } = renderHook(useTradeCanceledPopup)
    result.current.showTradeCanceled(contract, true)
    expect(usePopupStore.getState()).toEqual({
      ...usePopupStore.getState(),
      ...defaultPopupState,
    })
  })
  it('does not show trade cancel popup if sell offer has already been re-published', () => {
    getSellOfferFromContractMock.mockReturnValueOnce({ ...sellOffer, newOfferId: '4' })
    const { result } = renderHook(useTradeCanceledPopup)
    result.current.showTradeCanceled(contract, true)
    expect(usePopupStore.getState()).toEqual({
      ...usePopupStore.getState(),
      ...defaultPopupState,
    })
  })
})
