import { View } from 'react-native'
import { Icon, Screen, Text } from '.'
import { IconType } from '../assets/icons'
import tw from '../styles/tailwind'

type Props = {
  buttons: React.ReactNode
  title: string
  text: string
  iconId: IconType
}

export function Overlay ({ buttons, title, text, iconId }: Props) {
  return (
    <Screen gradientBackground>
      <View style={tw`grow`}>
        <View style={tw`justify-center gap-8 grow`}>
          <Text style={tw`text-center h4 text-primary-background-light shrink`}>{title}</Text>
          <View style={tw`flex-row items-center gap-6`}>
            <Icon id={iconId} size={92} color={tw`text-primary-background-light`.color} />
            <Text style={tw`flex-1 body-l text-primary-background-light`}>{text}</Text>
          </View>
        </View>

        <View style={tw`self-center gap-3`}>{buttons}</View>
      </View>
    </Screen>
  )
}
