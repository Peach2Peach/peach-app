import Clipboard from '@react-native-clipboard/clipboard'
import { useState } from 'react'
import { BarCodeReadEvent } from 'react-native-camera'
import { parseBitcoinRequest } from '../../utils/bitcoin'
import i18n from '../../utils/i18n'
import { cutOffAddress } from '../../utils/string'
import ScanQR from '../camera/ScanQR'
import Input, { InputProps } from './Input'

export const BitcoinAddressInput = ({ value, onChange, ...props }: InputProps & { value: string }) => {
  const [showQRScanner, setShowQRScanner] = useState(false)
  const [isFocused, setFocused] = useState(false)
  const pasteAddress = async () => {
    const clipboard = await Clipboard.getString()
    const request = parseBitcoinRequest(clipboard)
    if (onChange) onChange(request.address || clipboard)
  }

  const showQR = () => setShowQRScanner(true)
  const closeQR = () => setShowQRScanner(false)
  const onQRScanSuccess = ({ data }: BarCodeReadEvent) => {
    const request = parseBitcoinRequest(data)

    if (onChange) onChange(request.address || data)
    closeQR()
  }

  return !showQRScanner ? (
    <Input
      {...{
        placeholder: i18n('form.address.btc.placeholder'),
        icons: [
          ['clipboard', pasteAddress],
          ['camera', showQR],
        ],
        onChange,
        onFocus: () => setFocused(true),
        onBlur: () => setFocused(false),
        value: isFocused ? value : cutOffAddress(value),
        ...props,
      }}
    />
  ) : (
    <ScanQR onSuccess={onQRScanSuccess} onCancel={closeQR} testID={'qr-code-scanner'} />
  )
}
