import { ConfirmSlider } from '../../components/inputs'
import i18n from '../../utils/i18n'
import { useReleaseEscrow } from './hooks/useReleaseEscrow'

type Props = {
  contract: Contract
} & ComponentProps

export const ReleaseEscrowSlider = ({ contract, style }: Props) => {
  const releaseEscrow = useReleaseEscrow(contract)

  return <ConfirmSlider style={style} label1={i18n('releaseEscrow')} onConfirm={releaseEscrow} />
}
