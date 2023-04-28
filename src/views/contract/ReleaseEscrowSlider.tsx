import tw from '../../styles/tailwind'
import { SlideToUnlock } from '../../components/inputs'
import { useReleaseEscrow } from './hooks/useReleaseEscrow'

export const ReleaseEscrowSlider = ({ contract }: { contract: Contract }) => {
  const releaseEscrow = useReleaseEscrow(contract)

  return <SlideToUnlock style={tw`w-[263px] mt-3`} label1="release escrow" onUnlock={releaseEscrow} />
}
