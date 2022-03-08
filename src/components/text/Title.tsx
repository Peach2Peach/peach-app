import React, { ReactElement, ReactNode, useContext } from 'react'
import { Image, Pressable, View } from 'react-native'
import Icon from '../Icon'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'
import { OverlayContext } from '../../utils/overlay'
import { Text } from '.'

type TitleProps = {
  title: string,
  subtitle?: string,
  help?: ReactNode
}

export const Title = ({ title, subtitle, help }: TitleProps): ReactElement => {
  const [, updateOverlay] = useContext(OverlayContext)

  return <View style={tw`flex items-center`}>
    <Image source={require('../../../assets/favico/peach-logo.png')} style={tw`w-12 h-12`}/>
    <Text style={tw`font-baloo text-center text-4xl leading-5xl uppercase text-peach-1 mt-3`}>
      {title}
    </Text>
    {subtitle
      ? <View style={tw`flex justify-center -mt-4`}>
        <Text style={tw`text-center leading-6 text-grey-2 `}>
          {i18n(subtitle)}
        </Text>
        {help // TODO open help
          ? <Pressable style={tw`absolute -right-7`}
            onPress={() => updateOverlay({ content: help, showCloseButton: true })}>
            <Icon id="help" style={tw`w-5 h-5`} />
          </Pressable>
          : null
        }
      </View>
      : null
    }
  </View>
}

export default Title