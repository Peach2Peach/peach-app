import React, { ReactElement } from 'react'
import { Modal, View } from 'react-native'

import { BarCodeReadEvent } from 'react-native-camera'

import QRCodeScanner from 'react-native-qrcode-scanner'
import { Button, Text } from '..'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'
import GetWindowDimensions from '../../hooks/GetWindowDimensions'

interface ScanQRProps {
  onSuccess(e: BarCodeReadEvent): void;
  onCancel(): void;
}

export const ScanQR = ({ onSuccess, onCancel }: ScanQRProps): ReactElement => {
  const viewSize = (GetWindowDimensions().width || 320) * 0.75

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
      <View style={tw`absolute top-0 left-0 w-full h-full flex z-10`}>
        <View style={tw`bg-peach-translucent w-full h-full flex-shrink flex justify-end items-center`}>
          <Text style={tw`text-white-2 font-baloo text-xl mb-4 uppercase`}>
            {i18n('scanBTCAddress')}
          </Text>
        </View>
        <View style={tw`flex-shrink-0 flex-row`}>
          <View style={tw`bg-peach-translucent w-full h-full flex-shrink`} />
          <View style={{ width: viewSize, height: viewSize }} />
          <View style={tw`bg-peach-translucent w-full h-full flex-shrink`} />
        </View>
        <View style={tw`bg-peach-translucent w-full h-full flex-shrink flex justify-center items-center`}>
          <Button title="Cancel" tertiary={true} onPress={onCancel} wide={false} />
        </View>
      </View>
    </View>
  </Modal>
}

export default ScanQR