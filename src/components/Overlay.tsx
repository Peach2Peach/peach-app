import { View } from 'react-native'
import { IconType } from '../assets/icons'
import tw from '../styles/tailwind'
import { Icon } from './Icon'
import { Screen } from './Screen'
import { PeachText } from './text/Text'

type Props = {
  buttons: React.ReactNode
  title: string
  text: string
  iconId?: IconType
}

export function Overlay ({ buttons, title, text, iconId }: Props) {
  return (
    <Screen gradientBackground>
      <View style={tw`grow`}>
        <View style={tw`justify-center gap-8 grow`}>
          <PeachText style={tw`text-center h4 text-primary-background-light shrink`}>{title}</PeachText>
          <View style={tw`flex-row items-center gap-6`}>
            {iconId && <Icon id={iconId} size={92} color={tw.color('primary-background-light')} />}
            <PeachText style={[tw`flex-1 body-l text-primary-background-light`, !iconId && tw`text-center`]}>
              {text}
            </PeachText>
          </View>
        </View>

        <View style={tw`self-center gap-3`}>{buttons}</View>
      </View>
    </Screen>
  )
}
