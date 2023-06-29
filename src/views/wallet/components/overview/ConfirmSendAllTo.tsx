import { SlideToUnlock } from '../../../../components/inputs'
import i18n from '../../../../utils/i18n'
import { useSendAllTo } from '../../hooks/useSendAllTo'

type Props = ComponentProps & {
  address: string
  onSuccess: (txId: string) => void
  disabled?: boolean
}
export const ConfirmSendAllTo = ({ address, onSuccess, disabled, style }: Props) => {
  const sendAllTo = useSendAllTo({ address, onSuccess })

  return <SlideToUnlock style={style} disabled={disabled} label1={i18n('wallet.withdrawAll')} onUnlock={sendAllTo} />
}
