import React, { ReactElement } from 'react'
import { Dimensions, Modal, View } from 'react-native'

import { BarCodeReadEvent } from 'react-native-camera'

import QRCodeScanner from 'react-native-qrcode-scanner'
import { Button, Text } from '..'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'
import FocusView from './focusView.svg'
interface ScanQRProps {
  onSuccess(e: BarCodeReadEvent): void;
  onCancel(): void;
}

export const ScanQR = ({ onSuccess, onCancel }: ScanQRProps): ReactElement => {
  const windowDimensions = Dimensions.get('window')
  const viewSize = windowDimensions.width * 0.75
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
        showMarker
        customMarker={
          <View style={tw`w-full h-full`}>
            <View style={tw`bg-peach-translucent flex-1 items-center justify-end`}>
              <Text style={tw`text-white-2 font-baloo text-xl mb-4 uppercase h-10`}>
                {i18n('scanBTCAddress')}
              </Text>
            </View>
            <View style={tw`w-full flex-row`}>
              <View style={[
                { width: Math.round((windowDimensions.width - viewSize) / 2) },
                tw`bg-peach-translucent`
              ]}/>
              <View style={{
                width: viewSize,
                height: viewSize,
              }}>
                <FocusView/>
              </View>
              <View style={[
                { width: Math.round((windowDimensions.width - viewSize) / 2) },
                tw`bg-peach-translucent`
              ]}/>
            </View>
            <View style={tw`bg-peach-translucent flex-1`}>
              <Button
                title={i18n('cancel')}
                tertiary={true}
                onPress={onCancel}
                wide={false}
                style={tw`m-auto`}/>
            </View>
          </View>
        }/>
    </View>
  </Modal>
}

export default ScanQR