import { PopupAction } from '../components/popup/PopupAction'
import { useConfigStore } from '../store/configStore/configStore'
import tw from '../styles/tailwind'
import i18n from '../utils/i18n'
import { sum } from '../utils/math/sum'
import { WarningPopup } from './WarningPopup'
import { ClosePopupAction } from './actions/ClosePopupAction'
import { useCancelAndStartRefundPopup } from './useCancelAndStartRefundPopup'
import { IncorrectFunding } from './warning/IncorrectFunding'
import { WrongFundingAmount } from './warning/WrongFundingAmount'

export function WronglyFundedPopup ({ sellOffer }: { sellOffer: SellOffer }) {
  const maxTradingAmount = useConfigStore((state) => state.maxTradingAmount)
  const cancelAndStartRefundPopup = useCancelAndStartRefundPopup()

  const utxos = sellOffer.funding.txIds.length
  const title = i18n(utxos === 1 ? 'warning.wrongFundingAmount.title' : 'warning.incorrectFunding.title')
  const content
    = utxos === 1 ? (
      <WrongFundingAmount
        amount={sellOffer.amount}
        actualAmount={sellOffer.funding.amounts.reduce(sum, 0)}
        maxAmount={maxTradingAmount}
      />
    ) : (
      <IncorrectFunding utxos={utxos} />
    )

  return (
    <WarningPopup
      title={title}
      content={content}
      actions={
        <>
          <ClosePopupAction textStyle={tw`text-black-100`} />
          <PopupAction
            label={i18n('refundEscrow')}
            iconId="arrowRightCircle"
            textStyle={tw`text-black-100`}
            onPress={() => {
              cancelAndStartRefundPopup(sellOffer)
            }}
            reverseOrder
          />
        </>
      }
    />
  )
}
