import tw from '../../styles/tailwind'
import { ConfirmSlider } from '../../components/inputs'
import { useReleaseEscrow } from './hooks/useReleaseEscrow'
import i18n from '../../utils/i18n'

type Props = {
  contract: Contract
} & ComponentProps

export const ReleaseEscrowSlider = ({ contract, style }: Props) => {
  const releaseEscrow = useReleaseEscrow(contract)

  return <ConfirmSlider style={[tw`w-[263px]`, style]} label1={i18n('releaseEscrow')} onUnlock={releaseEscrow} />
}
