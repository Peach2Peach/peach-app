import React, { ReactElement, ReactNode, useContext } from 'react'
import { Image, Pressable, View } from 'react-native'
import { Text } from '../../../components'
import Icon from '../../../components/Icon'
import tw from '../../../styles/tailwind'
import i18n from '../../../utils/i18n'
import { OverlayContext } from '../../../utils/overlayUtils'

type TitleProps = {
  subtitle?: string|null,
  help?: ReactNode
}

export default ({ subtitle, help }: TitleProps): ReactElement => {
  const [, updateOverlay] = useContext(OverlayContext)

  return <View style={tw`flex items-center`}>
    <Image source={require('../../../../assets/favico/peach-logo.png')} style={tw`w-12 h-12`}/>
    <Text style={tw`font-baloo text-center text-4xl leading-5xl uppercase text-peach-1 mt-3`}>
      {i18n('sell.title')}
    </Text>
    {subtitle
      ? <View style={tw`flex justify-center -mt-4`}>
        <Text style={tw`text-center leading-6 text-grey-2 `}>
          {i18n(subtitle)}
        </Text>
        {help // TODO open help
          ? <Pressable style={tw`absolute -right-7`}
            onPress={() => updateOverlay({ overlayContent: help })}>
            <Icon id="help" style={tw`w-5 h-5`} />
          </Pressable>
          : null
        }
      </View>
      : null
    }
  </View>
}