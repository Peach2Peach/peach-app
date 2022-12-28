import React from 'react'
import Clipboard from '@react-native-clipboard/clipboard'
import { TouchableOpacity, View } from 'react-native'
import { Icon, Text } from '../../../../components'
import tw from '../../../../styles/tailwind'
import i18n from '../../../../utils/i18n'

export const PublicKey = ({ publicKey, style }: { publicKey: string } & ComponentProps) => (
  <View style={style}>
    <Text style={tw`body-m text-black-2 lowercase`}>{i18n('profile.publicKey')}:</Text>
    <View style={tw`flex-row items-center`}>
      <Text style={tw`text-black-1 subtitle-2 uppercase flex-shrink`}>
        <Text style={tw`text-primary-main subtitle-2`}>{publicKey.slice(0, 8)}</Text>
        {publicKey.slice(8)}
      </Text>

      <TouchableOpacity onPress={() => Clipboard.setString(publicKey)} style={tw`pl-3`}>
        <Icon id="copy" color={tw`text-primary-main`.color} style={tw`w-6 h-6`} />
      </TouchableOpacity>
    </View>
  </View>
)
