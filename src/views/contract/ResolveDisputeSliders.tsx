import { ConfirmSlider } from '../../components/inputs'
import { useStartRefundPopup } from '../../popups/useStartRefundPopup'
import { getSellOfferFromContract } from '../../utils/contract'
import i18n from '../../utils/i18n'
import { useContractContext } from './context'
import { useRepublishOffer } from './hooks/useRepublishOffer'

const RepublishOfferSlider = ({ contract }: { contract: Contract }) => {
  const republishOffer = useRepublishOffer()
  return <ConfirmSlider onConfirm={() => republishOffer(contract)} label1={i18n('republishOffer')} />
}

const RefundEscrowSlider = ({ contract }: { contract: Contract }) => {
  const startRefund = useStartRefundPopup()
  return (
    <ConfirmSlider onConfirm={() => startRefund(getSellOfferFromContract(contract))} label1={i18n('refundEscrow')} />
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
