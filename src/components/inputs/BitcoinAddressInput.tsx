import Clipboard from '@react-native-clipboard/clipboard'
import { useState } from 'react'
import { useQRScanner } from '../../hooks/useQRScanner'
import tw from '../../styles/tailwind'
import { parseBitcoinRequest } from '../../utils/bitcoin/parseBitcoinRequest'
import i18n from '../../utils/i18n'
import { cutOffAddress } from '../../utils/string/cutOffAddress'
import { ScanQR } from '../camera/ScanQR'
import { Input, InputProps } from './Input'

export const BitcoinAddressInput = ({ value, onChange, ...props }: InputProps & { value: string }) => {
  const [isFocused, setFocused] = useState(false)
  const pasteAddress = async () => {
    const clipboard = await Clipboard.getString()
    const request = parseBitcoinRequest(clipboard)
    if (onChange) onChange(request.address || clipboard)
  }
  const onSuccess = (data: string) => {
    const request = parseBitcoinRequest(data)
    if (onChange) onChange(request.address || data)
  }
  const { showQRScanner, showQR, closeQR, onRead } = useQRScanner({ onSuccess })

  return !showQRScanner ? (
    <Input
      placeholder={i18n('form.address.btc.placeholder')}
      placeholderTextColor={tw.color('black-5')}
      icons={[
        ['clipboard', pasteAddress],
        ['camera', showQR],
      ]}
      onChange={onChange}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      value={isFocused ? value : cutOffAddress(value)}
      {...props}
    />
  ) : (
    <ScanQR onRead={onRead} onCancel={closeQR} />
  )
}
