import { act, fireEvent, render, renderHook } from 'test-utils'
import { contract } from '../../../peach-api/src/testData/contract'
import { account1 } from '../../../tests/unit/data/accountData'
import { sellOffer } from '../../../tests/unit/data/offerData'
import { Popup } from '../../components/popup'
import { defaultPopupState, usePopupStore } from '../../store/usePopupStore'
import tw from '../../styles/tailwind'
import { setAccount } from '../../utils/account/account'
import { getSellOfferIdFromContract } from '../../utils/contract/getSellOfferIdFromContract'
import { peachAPI } from '../../utils/peachAPI'
import { getResult } from '../../utils/result/getResult'
import { PeachWallet } from '../../utils/wallet/PeachWallet'
import { setPeachWallet } from '../../utils/wallet/setWallet'
import { GrayPopup } from '../GrayPopup'
import { ClosePopupAction } from '../actions'
import { SellerCanceledContent } from './SellerCanceledContent'
import { useConfirmCancelTrade } from './useConfirmCancelTrade'

const showLoadingpopupMock = jest.fn()
jest.mock('../../hooks/useShowLoadingPopup', () => ({
  useShowLoadingPopup: () => showLoadingpopupMock,
}))

const saveOfferMock = jest.fn()
jest.mock('../../utils/offer/saveOffer', () => ({
  saveOffer: (...args: unknown[]) => saveOfferMock(...args),
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
  cancelContractAsSeller: (...args: unknown[]) => cancelContractAsSellerMock(...args),
}))
const cancelContractAsBuyerMock = jest.spyOn(peachAPI.private.contract, 'cancelContract')
describe('useConfirmCancelTrade', () => {
  beforeAll(() => {
    setAccount({ ...account1, offers: [{ ...sellOffer, id: getSellOfferIdFromContract(contract) }] })
    // @ts-ignore
    setPeachWallet(new PeachWallet())
  })
  beforeEach(() => {
    usePopupStore.setState(defaultPopupState)
  })

  it('should show confirm cancelation popup for buyer', async () => {
    setAccount({ ...account1, publicKey: contract.buyer.id })
    const { result } = renderHook(useConfirmCancelTrade)
    result.current(contract)

    const popupComponent = usePopupStore.getState().popupComponent || <></>
    const { toJSON, getAllByText } = render(popupComponent)
    expect(toJSON()).toMatchSnapshot()
    await act(async () => {
      await fireEvent.press(getAllByText('cancel trade')[1])
    })
    expect(cancelContractAsBuyerMock).toHaveBeenCalledWith({ contractId: contract.id })
  })
  it('should show confirm cancelation popup for seller', async () => {
    setAccount({
      ...account1,
      offers: [{ ...sellOffer, id: getSellOfferIdFromContract(contract) }],
      publicKey: contract.seller.id,
    })
    const { result } = renderHook(useConfirmCancelTrade)
    result.current(contract)

    const popupComponent = usePopupStore.getState().popupComponent || <></>
    const { toJSON, getAllByText } = render(popupComponent)
    expect(toJSON()).toMatchSnapshot()
    await act(async () => {
      await fireEvent.press(getAllByText('cancel trade')[1])
    })
    expect(cancelContractAsSellerMock).toHaveBeenCalledWith(contract)
  })
  it('should show the correct popup for cash trades of the seller', () => {
    const { result } = renderHook(useConfirmCancelTrade)
    result.current({ ...contract, paymentMethod: 'cash.someMeetup' })

    const popupComponent = usePopupStore.getState().popupComponent || <></>
    const { toJSON } = render(popupComponent)
    expect(toJSON()).toMatchSnapshot()
  })
  it('should show the correct confirmation popup for canceled trade as buyer', async () => {
    setAccount({ ...account1, publicKey: contract.buyer.id })

    const { result } = renderHook(useConfirmCancelTrade)
    result.current(contract)
    const { getAllByText } = render(<Popup />)
    await act(async () => {
      await fireEvent.press(getAllByText('cancel trade')[1])
    })

    expect(usePopupStore.getState().visible).toBeTruthy()
    expect(usePopupStore.getState().popupComponent).toStrictEqual(
      <GrayPopup title="trade canceled!" actions={<ClosePopupAction style={tw`justify-center`} />} />,
    )
  })
  it('should show the correct confirmation popup for canceled trade as seller', async () => {
    setAccount({
      ...account1,
      offers: [{ ...sellOffer, id: getSellOfferIdFromContract(contract) }],
      publicKey: contract.seller.id,
    })

    const { result } = renderHook(useConfirmCancelTrade)
    result.current(contract)

    const { getAllByText } = render(<Popup />)

    await act(async () => {
      await fireEvent.press(getAllByText('cancel trade')[1])
    })

    expect(usePopupStore.getState().visible).toBeTruthy()
    expect(usePopupStore.getState().popupComponent).toStrictEqual(
      <GrayPopup
        title="request sent"
        content={
          <SellerCanceledContent
            isCash={false}
            canRepublish={false}
            tradeID={contract.id}
            walletName={'custom payout address'}
          />
        }
        actions={<ClosePopupAction style={tw`justify-center`} />}
      />,
    )
  })
  it('shows the correct confirmation popup for canceled cash trade as seller with republish available', async () => {
    setAccount({
      ...account1,
      offers: [{ ...sellOffer, id: getSellOfferIdFromContract(contract), publishingDate: new Date() }],
      publicKey: contract.seller.id,
    })

    const { result } = renderHook(useConfirmCancelTrade)
    result.current({ ...contract, paymentMethod: 'cash.someMeetup' })

    const popupComponent = usePopupStore.getState().popupComponent || <></>
    const { getByText } = render(popupComponent)

    await act(async () => {
      await fireEvent.press(getByText('cancel trade'))
    })

    expect(usePopupStore.getState().visible).toBeTruthy()
    expect(usePopupStore.getState().popupComponent).toStrictEqual(
      <GrayPopup
        title="trade canceled"
        content={
          <SellerCanceledContent isCash canRepublish tradeID={contract.id} walletName={'custom payout address'} />
        }
        actions={<ClosePopupAction style={tw`justify-center`} />}
      />,
    )
  })
  it('shows the correct confirmation popup for canceled cash trade as seller with republish unavailable', async () => {
    setAccount({
      ...account1,
      offers: [{ ...sellOffer, id: getSellOfferIdFromContract(contract), publishingDate: new Date(0) }],
      publicKey: contract.seller.id,
    })

    const { result } = renderHook(useConfirmCancelTrade)
    result.current({ ...contract, paymentMethod: 'cash.someMeetup' })

    const popupComponent = usePopupStore.getState().popupComponent || <></>
    const { getByText } = render(popupComponent)

    await act(async () => {
      await fireEvent.press(getByText('cancel trade'))
    })
    expect(usePopupStore.getState().visible).toBeTruthy()
    expect(usePopupStore.getState().popupComponent).toStrictEqual(
      <GrayPopup
        title="trade canceled"
        content={
          <SellerCanceledContent
            isCash
            canRepublish={false}
            tradeID={contract.id}
            walletName={'custom payout address'}
          />
        }
        actions={<ClosePopupAction style={tw`justify-center`} />}
      />,
    )
  })
})
