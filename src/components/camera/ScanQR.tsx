import React, { ReactElement } from 'react'
import { Modal, View } from 'react-native'

import { BarCodeReadEvent } from 'react-native-camera'

import QRCodeScanner from 'react-native-qrcode-scanner'
import { Button, Text } from '..'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'
import GetWindowDimensions from '../../hooks/GetWindowDimensions'
import FocusView from './focusView.svg'
interface ScanQRProps {
  onSuccess(e: BarCodeReadEvent): void;
  onCancel(): void;
}

export const ScanQR = ({ onSuccess, onCancel }: ScanQRProps): ReactElement => {
  const windowDimensions = GetWindowDimensions()
  const viewSize = windowDimensions.width * 0.75
  const overlayY = [
    tw`bg-peach-translucent w-full`,
    { height: Math.round((windowDimensions.height - viewSize) / 2) }
  ]
  const overlayX = [
    tw`bg-peach-translucent h-full`,
    { width: Math.round((windowDimensions.width - viewSize) / 2) }
  ]

  return <Modal
    animationType="fade"
    transparent={false}
    visible={true}
    onRequestClose={onCancel}
  >
    <View style={tw`w-full h-full bg-black-1`}>
      <QRCodeScanner
        cameraStyle={tw`w-full h-full z-0`}
        onRead={onSuccess}
        vibrate={true}
      />
      <View style={tw`absolute top-0 left-0 w-full h-full z-10`}>
        <View style={[overlayY, tw`flex justify-end items-center`]}>
          <Text style={tw`text-white-2 font-baloo text-xl mb-4 uppercase`}>
            {i18n('scanBTCAddress')}
          </Text>
        </View>
        <View style={tw`flex-row`}>
          <View style={overlayX} />
          <View style={[tw`overflow-hidden`, { width: viewSize, height: viewSize }]}>
            <FocusView style={tw`w-full h-full`} />
          </View>
          <View style={overlayX} />
        </View>
        <View style={[overlayY, tw`flex justify-center items-center`]}>
          <Button title="Cancel" tertiary={true} onPress={onCancel} wide={false} />
        </View>
      </View>
    </View>
  </Modal>
}

export default ScanQR