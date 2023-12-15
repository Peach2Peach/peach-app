import { Modal, SafeAreaView, TouchableOpacity, View } from 'react-native'
import { BarCodeReadEvent } from 'react-native-camera'
import Svg, { Defs, Mask, Rect } from 'react-native-svg'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'
import { Icon } from '../Icon'
import { PeachText } from '../text/PeachText'
import { QRCodeScanner } from './QRCodeScanner'

type ScanQRProps = {
  onRead: (e: BarCodeReadEvent) => void
  onCancel: () => void
}

export const ScanQR = ({ onRead, onCancel }: ScanQRProps) => (
  <Modal transparent={false} onRequestClose={onCancel}>
    <QRCodeScanner onRead={onRead} customMarker={<CustomMarker onCancel={onCancel} />} />
  </Modal>
)

function CustomMarker ({ onCancel }: Pick<ScanQRProps, 'onCancel'>) {
  return (
    <View style={tw`w-full h-full`}>
      <CircleMask />
      <SafeAreaView style={tw`py-2`}>
        <TouchableOpacity style={tw`flex-row items-center ml-3`} onPress={onCancel}>
          <Icon id="chevronLeft" color={tw.color('primary-background-light')} style={tw`w-6 h-6 mr-1`} />
          <PeachText style={tw`h6 text-primary-background-light`} numberOfLines={1}>
            {i18n('scanBTCAddress')}
          </PeachText>
        </TouchableOpacity>
      </SafeAreaView>
    </View>
  )
}

function CircleMask () {
  return (
    <Svg style={tw`absolute top-0 left-0 w-full h-full`}>
      <Defs>
        <Mask id="mask" x="0" y="0" height="100%" width="100%">
          <Rect height="100%" width="100%" fill="#fff" />
          <Rect x={'10%'} y={'30%'} rx={20} width={'80%'} height={'40%'} fill={'black'} />
        </Mask>
      </Defs>
      <Rect height="100%" width="100%" fill="rgba(0, 0, 0, 0.6)" mask="url(#mask)" fill-opacity="0" />
    </Svg>
  )
}
