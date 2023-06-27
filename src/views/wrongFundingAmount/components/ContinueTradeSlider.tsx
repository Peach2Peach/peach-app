import { SlideToUnlock } from '../../../components/inputs'
import i18n from '../../../utils/i18n'
import { useConfirmEscrow } from '../hooks/useConfirmEscrow'

type Props = {
  sellOffer?: SellOffer
}
export const ContinueTradeSlider = ({ sellOffer }: Props) => {
  const confirmEscrow = useConfirmEscrow()
  const confirmEscrowWithSellOffer = () => {
    if (!sellOffer) return
    confirmEscrow(sellOffer)
  }

  return (
    <SlideToUnlock
      disabled={!sellOffer}
      onUnlock={confirmEscrowWithSellOffer}
      label1={i18n('continueTrade')}
      iconId="arrowRightCircle"
    />
  )
}
