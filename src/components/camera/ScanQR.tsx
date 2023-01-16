import React, { ReactElement } from 'react'
import { Dimensions, Modal, View } from 'react-native'

import { BarCodeReadEvent } from 'react-native-camera'

import QRCodeScanner from 'react-native-qrcode-scanner'
import { PrimaryButton, Text } from '..'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'
import FocusView from './focusView.svg'
interface ScanQRProps {
  onSuccess(e: BarCodeReadEvent): void
  onCancel(): void
}

export const ScanQR = ({ onSuccess, onCancel }: ScanQRProps): ReactElement => {
  const windowDimensions = Dimensions.get('window')
  const viewSize = windowDimensions.width * 0.75
  return (
    <Modal animationType="fade" transparent={false} visible={true} onRequestClose={onCancel}>
      <View style={tw`w-full h-full bg-black-1`}>
        <QRCodeScanner
          cameraStyle={tw`z-0 w-full h-full`}
          onRead={onSuccess}
          vibrate
          showMarker
          customMarker={
            <View style={tw`flex flex-col w-full h-full`}>
              <View style={tw`flex flex-col justify-end flex-shrink h-full pb-2 bg-peach-translucent`}>
                <View>
                  <Text style={tw`m-auto text-xl uppercase text-white-2 font-baloo leading-xl`}>
                    {i18n('scanBTCAddress')}
                  </Text>
                </View>
              </View>
              <View style={tw`flex-row flex-shrink-0 w-full`}>
                <View
                  style={[{ width: Math.round((windowDimensions.width - viewSize) / 2) }, tw`bg-peach-translucent`]}
                />
                <View style={{ width: viewSize, height: viewSize }}>
                  <FocusView />
                </View>
                <View
                  style={[{ width: Math.round((windowDimensions.width - viewSize) / 2) }, tw`bg-peach-translucent`]}
                />
              </View>
              <View style={tw`flex-row flex-shrink h-full bg-peach-translucent`}>
                <PrimaryButton onPress={onCancel} style={tw`m-auto`}>
                  {i18n('cancel')}
                </PrimaryButton>
              </View>
            </View>
          }
        />
      </View>
    </Modal>
  )
}

export default ScanQR
