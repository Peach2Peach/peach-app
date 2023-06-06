import tw from '../../styles/tailwind'
import { SlideToUnlock } from '../../components/inputs'
import { useRepublishOffer } from './hooks/useRepublishOffer'
import { getSellOfferFromContract } from '../../utils/contract'
import i18n from '../../utils/i18n'
import { useStartRefundPopup } from '../../popups/useStartRefundPopup'
import { useContractContext } from './context'

const RepublishOfferSlider = ({ contract }: { contract: Contract }) => {
  const republishOffer = useRepublishOffer()
  return (
    <SlideToUnlock style={tw`w-[263px]`} onUnlock={() => republishOffer(contract)} label1={i18n('republishOffer')} />
  )
}

const RefundEscrowSlider = ({ contract }: { contract: Contract }) => {
  const startRefund = useStartRefundPopup()
  return (
    <SlideToUnlock
      style={tw`w-[263px]`}
      onUnlock={() => startRefund(getSellOfferFromContract(contract))}
      label1={i18n('refundEscrow')}
    />
  )
}

export const ResolveDisputeSliders = () => {
  const props = useContractContext()
  return (
    <>
      <RepublishOfferSlider {...props} />
      <RefundEscrowSlider {...props} />
    </>
  )
}
