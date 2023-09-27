import { useState } from 'react'
import { BarCodeReadEvent } from 'react-native-camera'
import { PERMISSIONS, RESULTS, request as requestPermission } from 'react-native-permissions'
import { MissingPermissionsPopup } from '../popups/warning/MissingPermissionsPopup'
import { usePopupStore } from '../store/usePopupStore'
import { isIOS } from '../utils/system'

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
