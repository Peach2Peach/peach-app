import tw from '../../styles/tailwind'
import { SlideToUnlock } from '../../components/inputs'
import { useResolveDisputeActions } from './hooks/useResolveDisputeActions'
import { getSellOfferFromContract } from '../../utils/contract'

export const ResolveDisputeSliders = ({ contract }: { contract: Contract }) => {
  const { republishOffer, startRefund } = useResolveDisputeActions()
  return (
    <>
      <SlideToUnlock
        style={tw`w-[263px] mb-12px`}
        onUnlock={() => republishOffer(contract)}
        label1={'re-publish offer'}
      />
      <SlideToUnlock
        style={tw`w-[263px]`}
        onUnlock={() => startRefund(getSellOfferFromContract(contract))}
        label1={'refund escrow'}
      />
    </>
  )
}
