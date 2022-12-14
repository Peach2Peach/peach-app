import React, { ReactElement, useCallback, useContext, useMemo, useState } from 'react'
import { View } from 'react-native'

import tw from '../../styles/tailwind'

import { Icon, Input, PrimaryButton, ScanQR, Text } from '../../components'
import { updateSettings } from '../../utils/account'
import { useHeaderSetup, useNavigation, useValidatedState } from '../../hooks'
import { HelpIcon } from '../../components/icons/components'
import { OverlayContext } from '../../contexts/overlay'
import { RefundAddressPopup } from './components/RefundAddressPopup'
import Clipboard from '@react-native-clipboard/clipboard'
import { parseBitcoinRequest } from '../../utils/bitcoin'
import i18n from '../../utils/i18n'
import { BarCodeReadEvent } from 'react-native-camera'

const rulesToCheck = { bitcoinAddress: true }
export default (): ReactElement => {
  const [address, setAddress, isValid, addressErrors] = useValidatedState<string>('', rulesToCheck)
  const [isUpdated, setUpdated] = useState(false)
  const [showQRScanner, setShowQRScanner] = useState(false)
  const navigation = useNavigation()

  const setReturnAddress = () => {
    if (isValid) {
      updateSettings({ returnAddress: address }, true)
      setUpdated(true)
    }
  }
  const [, updateOverlay] = useContext(OverlayContext)
  const showRefundAddressPopup = useCallback(() => {
    updateOverlay({
      content: <RefundAddressPopup />,
      level: 'INFO',
      visible: true,
      title: 'refund address',
      action2: {
        callback: () => {
          updateOverlay({ visible: false })
          navigation.navigate('contact')
        },
        label: 'help',
        icon: 'alertCircle',
      },
      action1: {
        callback: () => updateOverlay({ visible: false }),
        label: 'close',
        icon: 'xSquare',
      },
    })
  }, [navigation, updateOverlay])

  const pasteAddress = async () => {
    const clipboard = await Clipboard.getString()
    const request = parseBitcoinRequest(clipboard)
    setAddress(request.address || clipboard)
  }

  useHeaderSetup(
    useMemo(
      () => ({ title: 'refund address', icons: [{ iconComponent: <HelpIcon />, onPress: showRefundAddressPopup }] }),
      [showRefundAddressPopup],
    ),
  )

  const show = () => setShowQRScanner(true)
  const close = () => setShowQRScanner(false)
  const onQRScanSuccess = (e: BarCodeReadEvent) => {
    const request = parseBitcoinRequest(e.data)

    setAddress(request.address || e.data)
    close()
  }

  return !showQRScanner ? (
    <View style={tw`h-full w-full justify-center items-center`}>
      <Text style={tw`h6`}>set custom refund address</Text>
      {/** we are usign mx-16 here, because the icons the input to become wider than 100%. this seems wrong */}
      <View style={tw`mx-16 mt-4`}>
        <Input
          placeholder={i18n('form.address.btc')}
          icons={[
            ['clipboard', pasteAddress],
            ['camera', show],
          ]}
          value={address}
          isValid={isValid}
          errorMessage={addressErrors}
          onChange={setAddress}
        />
      </View>
      {isUpdated && (
        <View style={tw`w-full h-0 flex-row justify-center`}>
          <Text style={tw`button-medium h-6`}>ADDRESS SET</Text>
          <Icon id="check" style={tw`w-[20px] h-[20px] ml-1`} color={tw`text-success-main`.color} />
        </View>
      )}
      <PrimaryButton narrow style={tw`mt-16 absolute bottom-6`} onPress={setReturnAddress} disabled={isUpdated}>
        confirm
      </PrimaryButton>
    </View>
  ) : (
    <ScanQR onSuccess={onQRScanSuccess} onCancel={close} />
  )
}
