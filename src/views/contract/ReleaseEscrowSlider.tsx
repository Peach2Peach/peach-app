import { ConfirmSlider } from '../../components/inputs'
import i18n from '../../utils/i18n'
import { useReleaseEscrow } from './hooks/useReleaseEscrow'

type Props = {
  contract: Contract
}

export const ReleaseEscrowSlider = ({ contract }: Props) => {
  const releaseEscrow = useReleaseEscrow(contract)

  return <ConfirmSlider label1={i18n('releaseEscrow')} onConfirm={releaseEscrow} />
}
