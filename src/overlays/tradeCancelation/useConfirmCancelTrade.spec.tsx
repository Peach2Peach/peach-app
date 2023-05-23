import { renderHook } from '@testing-library/react-native'
import { account1 } from '../../../tests/unit/data/accountData'
import { contract } from '../../../tests/unit/data/contractData'
import { sellOffer } from '../../../tests/unit/data/offerData'
import { unauthorizedError } from '../../../tests/unit/data/peachAPIData'
import { NavigationWrapper, replaceMock } from '../../../tests/unit/helpers/NavigationWrapper'
import { setAccount } from '../../utils/account'
import { getResult } from '../../utils/result'
import { ConfirmCancelTrade } from './ConfirmCancelTrade'
import { useConfirmCancelTrade } from './useConfirmCancelTrade'

const updateOverlayMock = jest.fn()
const useOverlayContextMock = jest.fn().mockReturnValue([, updateOverlayMock])
jest.mock('../../contexts/overlay', () => ({
  useOverlayContext: () => useOverlayContextMock(),
}))

const showLoadingOverlayMock = jest.fn()
const useShowLoadingOverlayMock = jest.fn().mockReturnValue(showLoadingOverlayMock)
jest.mock('../../hooks/useShowLoadingOverlay', () => ({
  useShowLoadingOverlay: () => useShowLoadingOverlayMock(),
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
  afterEach(() => {
    jest.clearAllMocks()
  })
  it('should return the correct default values', () => {
    const { result } = renderHook(useConfirmCancelTrade, { wrapper: NavigationWrapper })
    expect(result.current).toStrictEqual({
      showConfirmOverlay: expect.any(Function),
      cancelSeller: expect.any(Function),
      cancelBuyer: expect.any(Function),
      showLoadingOverlay: expect.any(Function),
      closeOverlay: expect.any(Function),
    })
  })
  it('should update popups when canceling a contract as seller', async () => {
    const { result } = renderHook(useConfirmCancelTrade, { wrapper: NavigationWrapper })
    const cancelSellerPromise = result.current.cancelSeller(contract)
    expect(showLoadingOverlayMock).toHaveBeenCalledWith({
      title: 'cancel trade',
      level: 'DEFAULT',
    })

    updateOverlayMock.mockClear()
    await cancelSellerPromise
    expect(updateOverlayMock).toHaveBeenCalledWith({ visible: false })
  })

  it('should cancel a contract as seller', async () => {
    const { result } = renderHook(useConfirmCancelTrade, { wrapper: NavigationWrapper })
    await result.current.cancelSeller(contract)
    expect(cancelContractAsSellerMock).toHaveBeenCalledWith(contract)
    expect(replaceMock).toHaveBeenCalledWith('contract', { contractId: contract.id })
  })
  it('should handle error case when canceling a contract as seller', async () => {
    cancelContractAsSellerMock.mockResolvedValueOnce(getResult({ contract }, unauthorizedError))
    const { result } = renderHook(useConfirmCancelTrade, { wrapper: NavigationWrapper })
    await result.current.cancelSeller(contract)
  })
  it('should optimistically update contract and offer after cancelation as seller', async () => {
    const { result } = renderHook(useConfirmCancelTrade, { wrapper: NavigationWrapper })
    await result.current.cancelSeller(contract)

    expect(saveContractMock).toHaveBeenCalledWith(contractUpdate)
    expect(saveOfferMock).toHaveBeenCalledWith(sellOfferUpdate)
  })
  it('should cancel a contract as buyer', async () => {
    const { result } = renderHook(useConfirmCancelTrade, { wrapper: NavigationWrapper })
    await result.current.cancelBuyer(contract)
    expect(cancelContractAsBuyerMock).toHaveBeenCalledWith(contract)
    expect(replaceMock).toHaveBeenCalledWith('contract', { contractId: contract.id })
    expect(updateOverlayMock).toHaveBeenCalledWith({
      level: 'DEFAULT',
      title: 'trade canceled!',
      visible: true,
    })
  })
  it('should handle error case when canceling a contract as buyer', async () => {
    cancelContractAsBuyerMock.mockResolvedValueOnce(getResult({ contract }, unauthorizedError))
    const { result } = renderHook(useConfirmCancelTrade, { wrapper: NavigationWrapper })
    await result.current.cancelBuyer(contract)
  })
  it('should optimistically update contract and offer after cancelation as buyer', async () => {
    const { result } = renderHook(useConfirmCancelTrade, { wrapper: NavigationWrapper })
    await result.current.cancelBuyer(contract)

    expect(saveContractMock).toHaveBeenCalledWith(contractUpdate)
  })
  it('should show confirm cancelation overlay for buyer', async () => {
    await setAccount({ ...account1, publicKey: contract.buyer.id })
    const { result } = renderHook(useConfirmCancelTrade, { wrapper: NavigationWrapper })
    const { cancelAction } = result.current.showConfirmOverlay(contract)

    expect(updateOverlayMock).toHaveBeenCalledWith({
      action1: {
        callback: cancelAction,
        icon: 'xCircle',
        label: 'cancel trade',
      },
      action2: {
        callback: result.current.closeOverlay,
        icon: 'arrowLeftCircle',
        label: 'never mind',
      },
      content: <ConfirmCancelTrade {...{ contract, view: 'buyer' }} />,
      level: 'DEFAULT',
      title: 'cancel trade',
      visible: true,
    })

    await cancelAction()
    expect(cancelContractAsBuyerMock).toHaveBeenCalledWith(contract)
  })
  it('should show confirm cancelation overlay for seller', async () => {
    await setAccount({ ...account1, publicKey: contract.seller.id })
    const { result } = renderHook(useConfirmCancelTrade, { wrapper: NavigationWrapper })
    const { cancelAction } = result.current.showConfirmOverlay(contract)

    expect(updateOverlayMock).toHaveBeenCalledWith({
      action1: {
        callback: cancelAction,
        icon: 'xCircle',
        label: 'cancel trade',
      },
      action2: {
        callback: result.current.closeOverlay,
        icon: 'arrowLeftCircle',
        label: 'never mind',
      },
      content: <ConfirmCancelTrade {...{ contract, view: 'seller' }} />,
      level: 'DEFAULT',
      title: 'cancel trade',
      visible: true,
    })
    await cancelAction()
    expect(cancelContractAsSellerMock).toHaveBeenCalledWith(contract)
  })
})
