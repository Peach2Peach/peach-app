import tw from '../../styles/tailwind'
import { SlideToUnlock } from '../../components/inputs'
import { useReleaseEscrow } from './hooks/useReleaseEscrow'
import i18n from '../../utils/i18n'

export const ReleaseEscrowSlider = ({ contract }: { contract: Contract }) => {
  const releaseEscrow = useReleaseEscrow(contract)

  return <SlideToUnlock style={tw`w-[263px] mt-3`} label1={i18n('releaseEscrow')} onUnlock={releaseEscrow} />
}
