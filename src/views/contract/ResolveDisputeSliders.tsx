import { useMemo } from 'react'
import { SlideToUnlock } from '../../components/inputs'
import { RefundEscrowSlider } from '../../components/offer'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'
import { useContractContext } from './context'
import { useRepublishOffer } from './hooks/useRepublishOffer'
import { getSellOfferFromContract } from '../../utils/contract'

const RepublishOfferSlider = ({ contract }: { contract: Contract }) => {
  const republishOffer = useRepublishOffer()
  return (
    <SlideToUnlock style={tw`w-[263px]`} onUnlock={() => republishOffer(contract)} label1={i18n('republishOffer')} />
  )
}

export const ResolveDisputeSliders = () => {
  const props = useContractContext()
  const sellOffer = useMemo(() => getSellOfferFromContract(props.contract), [props.contract])
  return (
    <>
      <RepublishOfferSlider {...props} />
      <RefundEscrowSlider sellOffer={sellOffer} />
    </>
  )
}
