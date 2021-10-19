import React, { ReactElement } from 'react'

import { BarCodeReadEvent } from 'react-native-camera'

import QRCodeScanner from 'react-native-qrcode-scanner'

interface ScanQRProps {
  onSuccess(e: BarCodeReadEvent): void;
}

export const ScanQR = ({ onSuccess }: ScanQRProps): ReactElement => <QRCodeScanner
  onRead={onSuccess}
  vibrate={true}
/>

export default ScanQR