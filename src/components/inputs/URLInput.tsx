import Clipboard from '@react-native-clipboard/clipboard'
import { useQRScanner } from '../../hooks/useQRScanner'
import i18n from '../../utils/i18n'
import { ScanQR } from '../camera/ScanQR'
import { Input, InputProps } from './Input'

export const URLInput = (props: InputProps) => {
  const pasteAddress = async () => {
    const clipboard = await Clipboard.getString()
    if (props.onChangeText) props.onChangeText(clipboard)
  }
  const onSuccess = (address: string) => {
    if (props.onChangeText) props.onChangeText(address)
  }
  const { showQRScanner, showQR, closeQR, onRead } = useQRScanner({ onSuccess })

  return !showQRScanner ? (
    <Input
      label={i18n('wallet.settings.node.address')}
      placeholder={i18n('wallet.settings.node.address.placeholder')}
      {...props}
      icons={
        props.icons ?? [
          ['clipboard', pasteAddress],
          ['camera', showQR],
        ]
      }
    />
  ) : (
    <ScanQR onRead={onRead} onCancel={closeQR} />
  )
}
