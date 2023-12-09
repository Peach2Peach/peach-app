import Clipboard from '@react-native-clipboard/clipboard'
import { useState } from 'react'
import { TouchableOpacity, View } from 'react-native'
import { Icon, Text } from '../../../../components'
import tw from '../../../../styles/tailwind'
import i18n from '../../../../utils/i18n'

export const PublicKey = ({ publicKey, style }: { publicKey: string } & ComponentProps) => {
  const [copied, setCopied] = useState(false)
  const copy = () => {
    Clipboard.setString(publicKey)
    setCopied(true)
  }
  return (
    <View style={style}>
      <Text style={tw`body-m text-black-2 lowercase`}>{i18n('profile.publicKey')}:</Text>
      <View style={tw`flex-row items-center`}>
        <Text style={tw`text-black-1 subtitle-2 uppercase shrink`}>
          <Text style={tw`text-primary-main subtitle-2`}>{publicKey.slice(0, 8)}</Text>
          {publicKey.slice(8)}
        </Text>

        <View style={tw`ml-3 items-center`}>
          <TouchableOpacity onPress={copy} accessibilityHint={i18n('copy')}>
            <Icon id="copy" color={tw.color('primary-main')} style={tw`w-6 h-6`} />
          </TouchableOpacity>
          {copied && <Text style={tw`text-primary-main subtitle-2`}>{i18n('copied')}</Text>}
        </View>
      </View>
    </View>
  )
}
