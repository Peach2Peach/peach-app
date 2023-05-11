import tw from '../../styles/tailwind'
import { SlideToUnlock } from '../../components/inputs'
import { useRepublishOffer } from './hooks/useRepublishOffer'
import { getSellOfferFromContract } from '../../utils/contract'
import i18n from '../../utils/i18n'
import { useStartRefundOverlay } from '../../overlays/useStartRefundOverlay'

const RepublishOfferSlider = ({ contract }: { contract: Contract }) => {
  const republishOffer = useRepublishOffer()
  return (
    <SlideToUnlock style={tw`w-[263px]`} onUnlock={() => republishOffer(contract)} label1={i18n('republishOffer')} />
  )
}

const RefundEscrowSlider = ({ contract }: { contract: Contract }) => {
  const startRefund = useStartRefundOverlay()
  return (
    <SlideToUnlock
      style={tw`w-[263px]`}
      onUnlock={() => startRefund(getSellOfferFromContract(contract))}
      label1={i18n('refundEscrow')}
    />
  )
}

export const ResolveDisputeSliders = (props: { contract: Contract }) => (
  <>
    <RepublishOfferSlider {...props} />
    <RefundEscrowSlider {...props} />
  </>
)
