import tw from '../../styles/tailwind'
import { SlideToUnlock } from '../../components/inputs'
import { useResolveDisputeActions } from './hooks/useResolveDisputeActions'
import { getSellOfferFromContract } from '../../utils/contract'
import i18n from '../../utils/i18n'

export const ResolveDisputeSliders = ({ contract }: { contract: Contract }) => {
  const { republishOffer, startRefund } = useResolveDisputeActions()
  return (
    <>
      <SlideToUnlock
        style={tw`w-[263px] mb-3`}
        onUnlock={() => republishOffer(contract)}
        label1={i18n('republishOffer')}
      />
      <SlideToUnlock
        style={tw`w-[263px]`}
        onUnlock={() => startRefund(getSellOfferFromContract(contract))}
        label1={i18n('refundEscrow')}
      />
    </>
  )
}
