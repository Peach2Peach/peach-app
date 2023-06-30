import { useCancelAndStartRefundPopup } from '../../popups/useCancelAndStartRefundPopup'
import i18n from '../../utils/i18n'
import { ConfirmSlider } from '../inputs'

type Props = {
  sellOffer?: SellOffer
}

export const RefundEscrowSlider = ({ sellOffer }: Props) => {
  const cancelAndStartRefundPopup = useCancelAndStartRefundPopup()
  const refundEscrow = () => {
    if (!sellOffer) return
    cancelAndStartRefundPopup(sellOffer)
  }
  return <ConfirmSlider disabled={!sellOffer} onConfirm={refundEscrow} label1={i18n('refundEscrow')} iconId="download" />
}
