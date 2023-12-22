import { useState } from 'react'
import { Linking } from 'react-native'
import { BarCodeReadEvent } from 'react-native-camera'
import { PERMISSIONS, RESULTS, request as requestPermission } from 'react-native-permissions'
import { PopupAction } from '../components/popup'
import { PeachText } from '../components/text/PeachText'
import { WarningPopup } from '../popups/WarningPopup'
import { ClosePopupAction } from '../popups/actions/ClosePopupAction'
import { usePopupStore } from '../store/usePopupStore'
import tw from '../styles/tailwind'
import i18n from '../utils/i18n'
import { isIOS } from '../utils/system/isIOS'

type Props = {
  onSuccess: (data: string) => void
}
export const useQRScanner = ({ onSuccess }: Props) => {
  const setPopup = usePopupStore((state) => state.setPopup)
  const [showQRScanner, setShowQRScanner] = useState(false)

  const showQR = () => {
    if (isIOS()) {
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
  const onRead = ({ data }: BarCodeReadEvent) => {
    onSuccess(data)
    closeQR()
  }

  return { showQRScanner, showQR, closeQR, onRead }
}

function MissingPermissionsPopup () {
  return (
    <WarningPopup
      title={i18n('settings.missingPermissions')}
      content={<PeachText>{i18n('settings.missingPermissions.text')}</PeachText>}
      actions={
        <>
          <ClosePopupAction textStyle={tw`text-black-100`} />
          <OpenSettingsAction />
        </>
      }
    />
  )
}

function OpenSettingsAction () {
  return (
    <PopupAction
      label={i18n('settings.openSettings')}
      textStyle={tw`text-black-100`}
      onPress={Linking.openSettings}
      iconId={'settings'}
      reverseOrder
    />
  )
}
