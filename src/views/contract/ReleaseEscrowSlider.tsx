import tw from '../../styles/tailwind'
import { SlideToUnlock } from '../../components/inputs'
import { useReleaseEscrow } from './hooks/useReleaseEscrow'
import i18n from '../../utils/i18n'

type Props = {
  contract: Contract
} & ComponentProps

export const ReleaseEscrowSlider = ({ contract, style }: Props) => {
  const releaseEscrow = useReleaseEscrow(contract)

  return <SlideToUnlock style={[tw`w-[263px]`, style]} label1={i18n('releaseEscrow')} onUnlock={releaseEscrow} />
}
