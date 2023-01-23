import React, { ReactElement, ReactNode, useContext } from 'react'
import { Pressable, View } from 'react-native'
import Icon from '../Icon'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'
import { OverlayContext } from '../../contexts/overlay'
import { Text } from '.'

type TitleProps = ComponentProps & {
  title: string
  subtitle?: string
  help?: ReactNode
}

export const Title = ({ title, subtitle, help, style }: TitleProps): ReactElement => {
  const [, updateOverlay] = useContext(OverlayContext)

  const openHelp = () => updateOverlay({ content: help, visible: true })

  return (
    <View style={[tw`flex items-center`, style]}>
      <Text style={[tw`text-center uppercase h3 text-peach-1`]}>{title}</Text>
      {subtitle ? (
        <View style={tw`flex-row items-center justify-center -mt-3`}>
          <Text style={tw`leading-6 text-center text-grey-2 `}>{i18n(subtitle)}</Text>
          {help ? (
            <Pressable style={tw`p-2`} onPress={openHelp}>
              <Icon id="helpCircle" style={tw`w-5 h-5`} color={tw`text-blue-1`.color} />
            </Pressable>
          ) : null}
        </View>
      ) : null}
    </View>
  )
}

export default Title
