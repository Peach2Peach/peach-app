import { ReactElement } from 'react'
import { Modal, TouchableOpacity, View, SafeAreaView } from 'react-native'
import { BarCodeReadEvent } from 'react-native-camera'
import QRCodeScanner from './CustomQRCodeScanner'
import Svg, { Defs, Mask, Rect } from 'react-native-svg'
import { Icon, Text } from '..'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'
type ScanQRProps = {
  onSuccess(e: BarCodeReadEvent): void
  onCancel(): void
  testID?: string
}

export const ScanQR = ({ onSuccess, onCancel }: ScanQRProps): ReactElement => {
  const CircleMask = () => (
    <Svg style={tw`w-full h-full`}>
      <Defs>
        <Mask id="mask" x="0" y="0" height="100%" width="100%">
          <Rect height="100%" width="100%" fill="#fff" />
          <Rect x={'10%'} y={'30%'} rx={20} width={'80%'} height={'40%'} fill={'black'} />
        </Mask>
      </Defs>
      <Rect height="100%" width="100%" fill="rgba(0, 0, 0, 0.6)" mask="url(#mask)" fill-opacity="0" />
    </Svg>
  )

  return (
    <Modal animationType="fade" transparent={false} visible={true} onRequestClose={onCancel}>
      <View style={tw`w-full h-full bg-black-1`}>
        <QRCodeScanner
          cameraStyle={tw`w-full h-full`}
          onRead={onSuccess}
          customMarker={
            <View style={tw`flex flex-col w-full h-full`}>
              <View style={tw`absolute top-0 left-0 w-full h-full`}>
                <CircleMask />
              </View>
              <SafeAreaView style={tw`py-2 ml-3 `}>
                <TouchableOpacity style={tw`flex-row items-center`} onPress={onCancel}>
                  <Icon id="chevronLeft" color={tw.color('primary-mild-1')} style={tw`w-6 h-6 mr-1`} />
                  <Text style={[tw`lowercase h6`, tw`text-primary-background-light`]} numberOfLines={1}>
                    {i18n('scanBTCAddress')}
                  </Text>
                </TouchableOpacity>
              </SafeAreaView>
            </View>
          }
        />
      </View>
    </Modal>
  )
}

export default ScanQR
