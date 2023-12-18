import { act, fireEvent, render, renderHook } from 'test-utils'
import { Popup } from '../components/popup'
import { PopupAction } from '../components/popup/PopupAction'
import { defaultPopupState, usePopupStore } from '../store/usePopupStore'
import tw from '../styles/tailwind'
import { WarningPopup } from './WarningPopup'
import { ClosePopupAction } from './actions/ClosePopupAction'
import { useShowWronglyFundedPopup } from './useShowWronglyFundedPopup'
import { IncorrectFunding } from './warning/IncorrectFunding'
import { WrongFundingAmount } from './warning/WrongFundingAmount'

const cancelAndStartRefundPopup = jest.fn()
jest.mock('./useCancelAndStartRefundPopup', () => ({
  useCancelAndStartRefundPopup: () => cancelAndStartRefundPopup,
}))

const useConfigStoreMock = jest.fn((selector) => selector({ maxTradingAmount: 2000000 }))
jest.mock('../store/configStore/configStore', () => ({
  useConfigStore: (selector: unknown) => useConfigStoreMock(selector),
}))

describe('useShowWronglyFundedPopup', () => {
  const maxTradingAmount = 2000000
  const amount = 100000
  const actualAmount = 110000

  beforeEach(() => {
    useConfigStoreMock.mockImplementation((selector) => selector({ maxTradingAmount }))
    usePopupStore.setState(defaultPopupState)
  })
  it('opens WrongFundingAmount popup', () => {
    const sellOffer: Partial<SellOffer> = {
      amount,
      funding: { txIds: ['1'], amounts: [actualAmount] } as FundingStatus,
    }
    const { result } = renderHook(useShowWronglyFundedPopup)
    act(() => {
      result.current(sellOffer as SellOffer)
    })

    expect(usePopupStore.getState().visible).toBeTruthy()
    expect(usePopupStore.getState().popupComponent).toStrictEqual(
      <WarningPopup
        title="trading limit exceeded"
        content={<WrongFundingAmount actualAmount={actualAmount} amount={amount} maxAmount={maxTradingAmount} />}
        actions={
          <>
            <ClosePopupAction textStyle={tw`text-black-1`} />
            <PopupAction
              label="refund escrow"
              iconId="arrowRightCircle"
              textStyle={tw`text-black-1`}
              onPress={expect.any(Function)}
              reverseOrder
            />
          </>
        }
      />,
    )
  })
  it('opens Incorrect Funding popup when funded with multiple transactions', () => {
    const sellOffer: Partial<SellOffer> = {
      amount,
      funding: { txIds: ['1', '2'], amounts: [amount] } as FundingStatus,
    }
    const { result } = renderHook(useShowWronglyFundedPopup)
    act(() => {
      result.current(sellOffer as SellOffer)
    })

    expect(usePopupStore.getState().visible).toBeTruthy()
    expect(usePopupStore.getState().popupComponent).toStrictEqual(
      <WarningPopup
        title="Incorrect funding"
        content={<IncorrectFunding utxos={2} />}
        actions={
          <>
            <ClosePopupAction textStyle={tw`text-black-1`} />
            <PopupAction
              label="refund escrow"
              iconId="arrowRightCircle"
              textStyle={tw`text-black-1`}
              onPress={expect.any(Function)}
              reverseOrder
            />
          </>
        }
      />,
    )
  })
  it('starts refund process', () => {
    const sellOffer: Partial<SellOffer> = {
      amount,
      funding: { txIds: ['1'], amounts: [actualAmount] } as FundingStatus,
    }
    const { result } = renderHook(useShowWronglyFundedPopup)
    act(() => {
      result.current(sellOffer as SellOffer)
    })
    const { getByText } = render(<Popup />)
    fireEvent.press(getByText('refund escrow'))
    expect(cancelAndStartRefundPopup).toHaveBeenCalledWith(sellOffer)
  })
})
