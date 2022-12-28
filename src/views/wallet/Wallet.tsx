import Clipboard from '@react-native-clipboard/clipboard'
import React, { useCallback, useState } from 'react'
import { View } from 'react-native'
import { BarCodeReadEvent } from 'react-native-camera'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { Icon, Input, ScanQR, Text } from '../../components'
import { BigSatsFormat } from '../../components/text'
import { useValidatedState } from '../../hooks'
import tw from '../../styles/tailwind'
import { openInWallet, parseBitcoinRequest } from '../../utils/bitcoin'
import i18n from '../../utils/i18n'
import { cutOffAddress } from '../../utils/string'
import { useWalletSetup } from './hooks/useWalletSetup'

const bitcoinAddressRules = { required: false, bitcoinAddress: true }

export default () => {
  useWalletSetup()
  const [address, setAddress, isValid, addressErrors] = useValidatedState<string>('', bitcoinAddressRules)
  const [showQRScanner, setShowQRScanner] = useState(false)
  const [isFocused, setFocused] = useState(false)

  const openWalletApp = () => openInWallet('bitcoin:')
  const pasteAddress = async () => {
    const clipboard = await Clipboard.getString()
    const request = parseBitcoinRequest(clipboard)
    setAddress(request.address || clipboard)
  }

  const showQR = () => setShowQRScanner(true)
  const closeQR = () => setShowQRScanner(false)
  const onQRScanSuccess = ({ data }: BarCodeReadEvent) => {
    const request = parseBitcoinRequest(data)

    setAddress(request.address || data)
    closeQR()
  }

  const onChange = useCallback(
    (value: string) => {
      setAddress(value)
    },
    [setAddress],
  )

  return !showQRScanner ? (
    <View style={tw`h-full flex flex-col justify-between px-8`}>
      <View style={tw`h-full flex-shrink flex flex-col justify-center items-center`}>
        <Text style={tw`button-medium mb-4`}>{i18n('wallet.totalBalance')}:</Text>
        <BigSatsFormat sats={50000} />
        <Text style={tw`button-medium mt-16`}>{i18n('wallet.withdrawTo')}:</Text>
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
            isValid,
            value: isFocused ? address : cutOffAddress(address),
            errorMessage: addressErrors,
          }}
        />
        <TouchableOpacity style={tw`flex-row justify-center items-center`} onPress={openWalletApp}>
          <Text style={tw`body-s underline text-black-2 uppercase`}>{i18n('wallet.openWalletApp')}</Text>
          <Icon id="externalLink" style={tw`w-4 h-4 ml-1 -mt-1`} color={tw`text-primary-main`.color} />
        </TouchableOpacity>
      </View>
      <View>
        <Text>withdraw slider todo</Text>
      </View>
    </View>
  ) : (
    <ScanQR onSuccess={onQRScanSuccess} onCancel={closeQR} />
  )
}
