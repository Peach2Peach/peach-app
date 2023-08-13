import Clipboard from '@react-native-clipboard/clipboard'
import { useState } from 'react'
import { Linking, Platform } from 'react-native'
import { BarCodeReadEvent } from 'react-native-camera'
import { PERMISSIONS, RESULTS, request as requestPermission } from 'react-native-permissions'
import { ClosePopupAction } from '../../popups/actions'
import { usePopupStore } from '../../store/usePopupStore'
import tw from '../../styles/tailwind'
import { parseBitcoinRequest } from '../../utils/bitcoin'
import i18n from '../../utils/i18n'
import { cutOffAddress } from '../../utils/string'
import { ScanQR } from '../camera/ScanQR'
import { PopupAction } from '../popup'
import { PopupComponent } from '../popup/PopupComponent'
import { Text } from '../text'
import { Input, InputProps } from './Input'

export const BitcoinAddressInput = ({ value, onChange, ...props }: InputProps & { value: string }) => {
  const [showQRScanner, setShowQRScanner] = useState(false)
  const [isFocused, setFocused] = useState(false)
  const setPopup = usePopupStore((state) => state.setPopup)
  const pasteAddress = async () => {
    const clipboard = await Clipboard.getString()
    const request = parseBitcoinRequest(clipboard)
    if (onChange) onChange(request.address || clipboard)
  }

  const onCameraPress = () => {
    if (Platform.OS === 'ios') {
      requestPermission(PERMISSIONS.IOS.CAMERA).then((cameraStatus) => {
        if (cameraStatus === RESULTS.GRANTED) {
          setShowQRScanner(true)
        } else {
          setPopup(<MissingPermissionsPopup />)
        }
      })
    } else {
      setShowQRScanner(true)
    }
  }
  const closeQR = () => setShowQRScanner(false)
  const onQRScanSuccess = ({ data }: BarCodeReadEvent) => {
    const request = parseBitcoinRequest(data)

    if (onChange) onChange(request.address || data)
    closeQR()
  }

  return !showQRScanner ? (
    <Input
      placeholder={i18n('form.address.btc.placeholder')}
      placeholderTextColor={tw`text-black-5`.color}
      icons={[
        ['clipboard', pasteAddress],
        ['camera', onCameraPress],
      ]}
      onChange={onChange}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      value={isFocused ? value : cutOffAddress(value)}
      {...props}
    />
  ) : (
    <ScanQR onRead={onQRScanSuccess} onCancel={closeQR} />
  )
}

function MissingPermissionsPopup () {
  return (
    <PopupComponent
      title={i18n('settings.missingPermissions')}
      content={<MissingPermissionsContent />}
      actions={
        <>
          <ClosePopupAction textStyle={tw`text-black-1`} />
          <OpenSettingsAction />
        </>
      }
      bgColor={tw`bg-warning-background`}
      actionBgColor={tw`bg-warning-main`}
    />
  )
}

function MissingPermissionsContent () {
  return <Text>{i18n('settings.missingPermissions.text')}</Text>
}

function OpenSettingsAction () {
  return (
    <PopupAction
      label={'open settings'}
      textStyle={tw`text-black-1`}
      onPress={Linking.openSettings}
      iconId={'settingsGear'}
      reverseOrder
    />
  )
}
