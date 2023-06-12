import { renderHook } from '@testing-library/react-native'
import { account1 } from '../../../tests/unit/data/accountData'
import { contract } from '../../../tests/unit/data/contractData'
import { sellOffer } from '../../../tests/unit/data/offerData'
import { unauthorizedError } from '../../../tests/unit/data/peachAPIData'
import { NavigationWrapper, replaceMock } from '../../../tests/unit/helpers/NavigationWrapper'
import { defaultPopupState, usePopupStore } from '../../store/usePopupStore'
import { setAccount } from '../../utils/account'
import { getSellOfferIdFromContract } from '../../utils/contract'
import { getResult } from '../../utils/result'
import { PeachWallet } from '../../utils/wallet/PeachWallet'
import { setPeachWallet } from '../../utils/wallet/setWallet'
import { ConfirmCancelTrade } from './ConfirmCancelTrade'
import { SellerCanceledContent } from './SellerCanceledContent'
import { useConfirmCancelTrade } from './useConfirmCancelTrade'

const showLoadingpopupMock = jest.fn()
const useShowLoadingpopupMock = jest.fn().mockReturnValue(showLoadingpopupMock)
jest.mock('../../hooks/useShowLoadingPopup', () => ({
  useShowLoadingPopup: () => useShowLoadingpopupMock(),
}))

const saveContractMock = jest.fn()
jest.mock('../../utils/contract/saveContract', () => ({
  saveContract: (...args: any[]) => saveContractMock(...args),
}))
const saveOfferMock = jest.fn()
jest.mock('../../utils/offer/saveOffer', () => ({
  saveOffer: (...args: any[]) => saveOfferMock(...args),
}))

const contractUpdate = {
  ...contract,
  canceled: true,
}
const sellOfferUpdate = {
  ...sellOffer,
  refundTx: 'refundTx',
}
const cancelContractAsSellerMock = jest.fn().mockResolvedValue(
  getResult({
    contract: contractUpdate,
    sellOffer: sellOfferUpdate,
  }),
)
jest.mock('./helpers/cancelContractAsSeller', () => ({
  cancelContractAsSeller: (...args: any[]) => cancelContractAsSellerMock(...args),
}))
const cancelContractAsBuyerMock = jest.fn().mockResolvedValue(
  getResult({
    contract: contractUpdate,
  }),
)
jest.mock('./helpers/cancelContractAsBuyer', () => ({
  cancelContractAsBuyer: (...args: any[]) => cancelContractAsBuyerMock(...args),
}))
describe('useConfirmCancelTrade', () => {
  const wrapper = NavigationWrapper
  beforeAll(() => {
    setAccount({ ...account1, offers: [{ ...sellOffer, id: getSellOfferIdFromContract(contract) }] })
    // @ts-ignore
    setPeachWallet(new PeachWallet())
  })
  afterEach(() => {
    usePopupStore.setState(defaultPopupState)
  })
  it('should return the correct default values', () => {
    const { result } = renderHook(useConfirmCancelTrade, { wrapper })
    expect(result.current).toStrictEqual({
      showConfirmPopup: expect.any(Function),
      cancelSeller: expect.any(Function),
      cancelBuyer: expect.any(Function),
      closePopup: expect.any(Function),
    })
  })

  it('should cancel a contract as seller', async () => {
    const { result } = renderHook(useConfirmCancelTrade, { wrapper })
    await result.current.cancelSeller(contract)
    expect(cancelContractAsSellerMock).toHaveBeenCalledWith(contract)
    expect(replaceMock).toHaveBeenCalledWith('contract', { contractId: contract.id })
  })
  it('should handle error case when canceling a contract as seller', async () => {
    cancelContractAsSellerMock.mockResolvedValueOnce(getResult({ contract }, unauthorizedError))
    const { result } = renderHook(useConfirmCancelTrade, { wrapper })
    await result.current.cancelSeller(contract)
  })
  it('should optimistically update contract and offer after cancelation as seller', async () => {
    const { result } = renderHook(useConfirmCancelTrade, { wrapper })
    await result.current.cancelSeller(contract)

    expect(saveContractMock).toHaveBeenCalledWith(contractUpdate)
    expect(saveOfferMock).toHaveBeenCalledWith(sellOfferUpdate)
  })
  it('should cancel a contract as buyer', async () => {
    const { result } = renderHook(useConfirmCancelTrade, { wrapper })
    await result.current.cancelBuyer(contract)
    expect(cancelContractAsBuyerMock).toHaveBeenCalledWith(contract)
    expect(replaceMock).toHaveBeenCalledWith('contract', { contractId: contract.id })
    expect(usePopupStore.getState()).toEqual({
      ...usePopupStore.getState(),
      level: 'DEFAULT',
      title: 'trade canceled!',
      visible: true,
    })
  })
  it('should handle error case when canceling a contract as buyer', async () => {
    cancelContractAsBuyerMock.mockResolvedValueOnce(getResult({ contract }, unauthorizedError))
    const { result } = renderHook(useConfirmCancelTrade, { wrapper })
    await result.current.cancelBuyer(contract)
  })
  it('should optimistically update contract and offer after cancelation as buyer', async () => {
    const { result } = renderHook(useConfirmCancelTrade, { wrapper })
    await result.current.cancelBuyer(contract)

    expect(saveContractMock).toHaveBeenCalledWith(contractUpdate)
  })
  it('should show confirm cancelation popup for buyer', () => {
    setAccount({ ...account1, publicKey: contract.buyer.id })
    const { result } = renderHook(useConfirmCancelTrade, { wrapper })
    result.current.showConfirmPopup(contract)

    expect(usePopupStore.getState()).toEqual({
      ...usePopupStore.getState(),
      action1: {
        callback: expect.any(Function),
        icon: 'xCircle',
        label: 'cancel trade',
      },
      action2: {
        callback: expect.any(Function),
        icon: 'arrowLeftCircle',
        label: 'never mind',
      },
      content: <ConfirmCancelTrade {...{ contract, view: 'buyer' }} />,
      level: 'DEFAULT',
      title: 'cancel trade',
      visible: true,
    })

    usePopupStore.getState().action1?.callback()
    expect(cancelContractAsBuyerMock).toHaveBeenCalledWith(contract)
  })
  it('should show confirm cancelation popup for seller', () => {
    setAccount({
      ...account1,
      offers: [{ ...sellOffer, id: getSellOfferIdFromContract(contract) }],
      publicKey: contract.seller.id,
    })
    const { result } = renderHook(useConfirmCancelTrade, { wrapper })
    result.current.showConfirmPopup(contract)

    expect(usePopupStore.getState()).toEqual({
      ...usePopupStore.getState(),
      action1: {
        callback: expect.any(Function),
        icon: 'xCircle',
        label: 'cancel trade',
      },
      action2: {
        callback: expect.any(Function),
        icon: 'arrowLeftCircle',
        label: 'never mind',
      },
      content: <ConfirmCancelTrade {...{ contract, view: 'seller' }} />,
      level: 'DEFAULT',
      title: 'cancel trade',
      visible: true,
    })
    usePopupStore.getState().action1?.callback()
    expect(cancelContractAsSellerMock).toHaveBeenCalledWith(contract)
  })
  it('confirmpopup should be gray', () => {
    const { result } = renderHook(useConfirmCancelTrade, { wrapper })
    result.current.showConfirmPopup(contract)

    expect(usePopupStore.getState().level).toBe('DEFAULT')
  })
  it('should show the correct popup for cash trades of the seller', () => {
    const { result } = renderHook(useConfirmCancelTrade, { wrapper })
    result.current.showConfirmPopup({ ...contract, paymentMethod: 'cash' })

    expect(usePopupStore.getState()).toEqual({
      ...usePopupStore.getState(),
      action1: {
        callback: expect.any(Function),
        icon: 'xCircle',
        label: 'cancel trade',
      },
      action2: {
        callback: expect.any(Function),
        icon: 'arrowLeftCircle',
        label: 'never mind',
      },
      level: 'DEFAULT',
      title: 'cancel cash trade',
      content: <ConfirmCancelTrade view="seller" contract={{ ...contract, paymentMethod: 'cash' }} />,
      visible: true,
    })
  })
  it('should show the correct confirmation popup for canceled trade as buyer', () => {
    setAccount({ ...account1, publicKey: contract.buyer.id })

    const { result } = renderHook(useConfirmCancelTrade, { wrapper })
    result.current.showConfirmPopup(contract)
    usePopupStore.getState().action1?.callback()
    expect(usePopupStore.getState()).toEqual({
      ...usePopupStore.getState(),
      title: 'trade canceled!',
      level: 'DEFAULT',
      visible: true,
    })
  })
  it('should show the correct confirmation popup for canceled trade as seller', () => {
    setAccount({
      ...account1,
      offers: [{ ...sellOffer, id: getSellOfferIdFromContract(contract) }],
      publicKey: contract.seller.id,
    })

    const { result } = renderHook(useConfirmCancelTrade, { wrapper })
    result.current.showConfirmPopup(contract)
    usePopupStore.getState().action1?.callback()
    expect(usePopupStore.getState()).toEqual({
      ...usePopupStore.getState(),
      title: 'request sent',
      level: 'DEFAULT',
      content: (
        <SellerCanceledContent
          isCash={false}
          canRepublish={false}
          tradeID={contract.id}
          walletName={'custom payout address'}
        />
      ),
      visible: true,
    })
  })
  it('shows the correct confirmation popup for canceled cash trade as seller with republish available', () => {
    setAccount({
      ...account1,
      offers: [{ ...sellOffer, id: getSellOfferIdFromContract(contract), publishingDate: new Date() }],
      publicKey: contract.seller.id,
    })

    const { result } = renderHook(useConfirmCancelTrade, { wrapper })
    result.current.showConfirmPopup({ ...contract, paymentMethod: 'cash' })
    usePopupStore.getState().action1?.callback()
    expect(usePopupStore.getState()).toEqual({
      ...usePopupStore.getState(),
      title: 'trade canceled',
      level: 'DEFAULT',
      content: <SellerCanceledContent isCash canRepublish tradeID={contract.id} walletName={'custom payout address'} />,
      visible: true,
    })
  })
  it('shows the correct confirmation popup for canceled cash trade as seller with republish unavailable', () => {
    setAccount({
      ...account1,
      offers: [{ ...sellOffer, id: getSellOfferIdFromContract(contract), publishingDate: new Date(0) }],
      publicKey: contract.seller.id,
    })

    const { result } = renderHook(useConfirmCancelTrade, { wrapper })
    result.current.showConfirmPopup({ ...contract, paymentMethod: 'cash' })
    usePopupStore.getState().action1?.callback()
    expect(usePopupStore.getState()).toEqual({
      ...usePopupStore.getState(),
      title: 'trade canceled',
      level: 'DEFAULT',
      content: (
        <SellerCanceledContent isCash canRepublish={false} tradeID={contract.id} walletName={'custom payout address'} />
      ),
      visible: true,
    })
  })
})
